import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { NextPage } from "next";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import { Messages, REACT_APP_API_URL } from "../../config";
import { getJwtToken, updateStorage, updateUserInfo } from "../../auth";
import { useMutation, useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { MemberUpdate } from "../../types/member/member.update";
import { MemberRequestExpert } from "../../enums/member.enum";
import { UPDATE_MEMBER } from "../../../apollo/user/mutation";
import { sweetMixinErrorAlert, sweetMixinSuccessAlert } from "../../sonner";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";

const MyProfile: NextPage = ({ initialValues }: any) => {
  const { t } = useTranslation("common");
  const device = useDeviceDetect();
  const token = getJwtToken();
  const user = useReactiveVar(userVar);
  const [updateData, setUpdateData] = useState<MemberUpdate>(initialValues);

  /** APOLLO REQUESTS **/
  const [updateMember] = useMutation(UPDATE_MEMBER);

  /** LIFECYCLES **/
  useEffect(() => {
    setUpdateData({
      ...updateData,
      memberNick: user.memberNick,
      memberPhone: user.memberPhone,
      memberFullName: user.memberFullName,
      memberAddress: user.memberAddress,
      memberDesc: user.memberDesc,
      memberImage: user.memberImage,
    });
  }, [user]);

  /** HANDLERS **/
  const uploadImage = async (e: any) => {
    try {
      const image = e.target.files[0];
      const formData = new FormData();
      formData.append(
        "operations",
        JSON.stringify({
          query: `mutation ImageUploader($file: Upload!, $target: String!) {
            imageUploader(file: $file, target: $target)
          }`,
          variables: { file: null, target: "member" },
        }),
      );
      formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
      formData.append("0", image);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_GRAPHQL_URL}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "apollo-require-preflight": true,
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const responseImage = response.data.data.imageUploader;
      updateData.memberImage = responseImage;
      setUpdateData({ ...updateData });
    } catch (err) {
      console.log("Error, uploadImage:", err);
    }
  };

  const updateProfileHandler = useCallback(async () => {
    try {
      if (!user._id) throw new Error(Messages.error2);
      updateData._id = user._id;

      const result = await updateMember({ variables: { input: updateData } });
      //@ts-ignore
      const jwtToken = result.data.updateMember?.accessToken;
      updateStorage({ jwtToken });
      updateUserInfo(result.data.updateMember?.accessToken);
      await sweetMixinSuccessAlert("Profile updated successfully.");
    } catch (err: any) {
      sweetMixinErrorAlert(err.message).then();
    }
  }, [updateData]);

  const isDisabled = () => !updateData.memberNick;

  if (device === "mobile") return <>MY PROFILE PAGE MOBILE</>;

  return (
    <div id="my-profile-page">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <Stack className="main-title-box">
        <Typography className="main-title">{t("My Profile")}</Typography>
        <Typography className="sub-title">
          {t("Update your personal information")}
        </Typography>
      </Stack>

      {/* ── Profile card ────────────────────────────────────────────── */}
      <Stack className="profile-card">
        {/* Avatar upload */}
        <Stack className="photo-section">
          <Typography className="section-label">
            {t("Profile Photo")}
          </Typography>
          <Stack className="photo-row">
            <Stack className="avatar-wrap">
              <img
                src={
                  updateData?.memberImage
                    ? `${REACT_APP_API_URL}/${updateData.memberImage}`
                    : "/img/profile/defaultUser.svg"
                }
                alt="avatar"
                className="avatar-img"
                onError={(e) => {
                  e.currentTarget.src = "/img/profile/defaultUser.svg";
                }}
              />
            </Stack>
            <Stack className="upload-col">
              <input
                type="file"
                hidden
                id="avatar-input"
                onChange={uploadImage}
                accept="image/jpg, image/jpeg, image/png"
              />
              <label htmlFor="avatar-input" className="upload-btn">
                <CameraAltOutlinedIcon fontSize="small" />
                <span>{t("Upload Photo")}</span>
              </label>
              <Typography className="upload-hint">
                {t("JPG, JPEG or PNG · recommended 200×200")}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Fields */}
        <Stack className="fields-section">
          <Typography className="section-label">{t("Basic Info")}</Typography>

          <Stack className="fields-row">
            <Stack className="field-box">
              <Typography className="field-label">{t("Username")}</Typography>
              <input
                type="text"
                className="field-input"
                placeholder={t("Your username")}
                value={updateData.memberNick ?? ""}
                onChange={({ target: { value } }) =>
                  setUpdateData({ ...updateData, memberNick: value })
                }
              />
            </Stack>
            <Stack className="field-box">
              <Typography className="field-label">{t("Full Name")}</Typography>
              <input
                type="text"
                className="field-input"
                placeholder={t("Your full name")}
                value={updateData.memberFullName ?? ""}
                onChange={({ target: { value } }) =>
                  setUpdateData({ ...updateData, memberFullName: value })
                }
              />
            </Stack>
          </Stack>

          <Stack className="fields-row">
            <Stack className="field-box">
              <Typography className="field-label">{t("Phone")}</Typography>
              <input
                type="text"
                className="field-input"
                placeholder={t("+1 000 000 0000")}
                value={updateData.memberPhone ?? ""}
                onChange={({ target: { value } }) =>
                  setUpdateData({ ...updateData, memberPhone: value })
                }
              />
            </Stack>
            <Stack className="field-box">
              <Typography className="field-label">{t("Address")}</Typography>
              <input
                type="text"
                className="field-input"
                placeholder={t("City, Country")}
                value={updateData.memberAddress ?? ""}
                onChange={({ target: { value } }) =>
                  setUpdateData({ ...updateData, memberAddress: value })
                }
              />
            </Stack>
          </Stack>

          <Stack className="field-box full-width">
            <Typography className="field-label">{t("Bio")}</Typography>
            <textarea
              className="field-textarea"
              placeholder={t("Tell us about your fragrance journey...")}
              value={updateData.memberDesc ?? ""}
              onChange={({ target: { value } }) =>
                setUpdateData({ ...updateData, memberDesc: value })
              }
            />
          </Stack>
        </Stack>

        {/* Save button */}
        <Stack className="action-row">
          <Button
            className="save-btn"
            onClick={updateProfileHandler}
            disabled={isDisabled()}
          >
            <Typography>{t("Save Changes")}</Typography>
          </Button>
        </Stack>
      </Stack>

      {/* ── Become Expert (USER only) ────────────────────────────────── */}
      {user?.memberType === "USER" && (
        <Stack className="expert-request-card">
          <Stack className="expert-request-inner">
            <Stack className="expert-request-text">
              <Typography className="expert-request-title">
                {t("Become an Expert")}
              </Typography>
              <Typography className="expert-request-desc">
                {t(
                  "Share your fragrance knowledge, write articles, and build a following. Send a request to become a verified Expert.",
                )}
              </Typography>
            </Stack>
            <Button
              className="expert-request-btn"
              onClick={async () => {
                try {
                  if (!user._id) throw new Error(Messages.error2);
                  await updateMember({
                    variables: {
                      input: {
                        _id: user._id,
                        memberExpertRequest: MemberRequestExpert.REQUESTED,
                      },
                    },
                  });
                  await sweetMixinSuccessAlert(
                    t("Expert request sent successfully!"),
                  );
                } catch (err: any) {
                  sweetMixinErrorAlert(err.message).then();
                }
              }}
            >
              <Typography>{t("Request Expert Status")}</Typography>
            </Button>
          </Stack>
        </Stack>
      )}
    </div>
  );
};

MyProfile.defaultProps = {
  initialValues: {
    _id: "",
    memberImage: "",
    memberNick: "",
    memberPhone: "",
    memberFullName: "",
    memberAddress: "",
    memberDesc: "",
  },
};

export default MyProfile;

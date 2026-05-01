import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { BoardArticleCategory } from "../../enums/board-article.enum";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { Editor } from "@toast-ui/react-editor";
import { getJwtToken } from "../../auth";
import { REACT_APP_API_URL } from "../../config";
import { useRouter } from "next/router";
import axios from "axios";
import { CREATE_BOARD_ARTICLE } from "../../../apollo/user/mutation";
import { useMutation } from "@apollo/client";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../sonner";
import { Message } from "../../enums/common.enum";
import { T } from "../../types/common";

const CATEGORIES = [
  { value: BoardArticleCategory.FREE, label: "Free Board" },
  { value: BoardArticleCategory.RECOMMEND, label: "Recommend" },
  { value: BoardArticleCategory.NEWS, label: "News" },
  { value: BoardArticleCategory.HUMOR, label: "Humor" },
];

const TuiEditor = () => {
  const editorRef = useRef<Editor>(null),
    coverImageRef = useRef<HTMLInputElement>(null),
    token = getJwtToken(),
    router = useRouter();
  const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(
    BoardArticleCategory.FREE,
  );
  const [articleTitle, setArticleTitle] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [publishing, setPublishing] = useState(false);

  const [createBoardArticle] = useMutation(CREATE_BOARD_ARTICLE);

  const memoizedValues = useMemo(() => {
    const articleContent = "",
      articleImage = "";

    return { articleContent, articleImage };
  }, []);

  const getEditorText = () => {
    return editorRef.current?.getInstance().getMarkdown().trim() ?? "";
  };

  /** HANDLERS **/
  const uploadImage = async (image: any) => {
    try {
      const formData = new FormData();
      formData.append(
        "operations",
        JSON.stringify({
          query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target)
				  }`,
          variables: {
            file: null,
            target: "article",
          },
        }),
      );
      formData.append(
        "map",
        JSON.stringify({
          "0": ["variables.file"],
        }),
      );
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
      memoizedValues.articleImage = responseImage;

      return `${REACT_APP_API_URL}/${responseImage}`;
    } catch (err) {
      console.log("Error, uploadImage:", err);
    }
  };

  const uploadCoverImageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setCoverImagePreview(imageUrl);
      }
    } catch (err) {
      console.log("Error uploading cover image:", err);
    }
  };

  const changeCategoryHandler = (e: any) => {
    setArticleCategory(e.target.value);
  };

  const articleTitleHandler = (e: T) => {
    setArticleTitle(e.target.value);
  };

  const handleRegisterButton = async () => {
    try {
      if (articleTitle.trim().length < 3) {
        throw new Error(Message.INSERT_ALL_INPUTS);
      }
      if (getEditorText().length < 3) {
        throw new Error(Message.INSERT_ALL_INPUTS);
      }

      const articleContent = editorRef.current?.getInstance().getMarkdown().trim() ?? "";
      memoizedValues.articleContent = articleContent;

      setPublishing(true);
      await createBoardArticle({
        variables: {
          input: {
            ...memoizedValues,
            articleTitle: articleTitle.trim(),
            articleCategory,
          },
        },
      });

      await sweetTopSuccessAlert("Article is created successfully", 700);
      await router.push({
        pathname: "/mypage",
        query: {
          category: "myArticles",
        },
      });
    } catch (err: any) {
      console.log("ERROR handleRegisterButton:", err);
      sweetErrorHandling(err).then();
    } finally {
      setPublishing(false);
    }
  };

  const doDisabledCheck = () => {
    return articleTitle.trim().length < 3 || publishing;
  };

  /** PUBLISH **/

  return (
    <Stack>
      <Stack
        direction="row"
        className="wa-meta-row"
        justifyContent="space-evenly"
      >
        <Box component={"div"} className={"form_row"}>
          <Typography variant="h3">Category</Typography>
          <FormControl sx={{ width: "100%" }}>
            <Select
              value={articleCategory}
              onChange={changeCategoryHandler}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={BoardArticleCategory.FREE}>
                <span>Free</span>
              </MenuItem>
              <MenuItem value={BoardArticleCategory.HUMOR}>Humor</MenuItem>
              <MenuItem value={BoardArticleCategory.NEWS}>News</MenuItem>
              <MenuItem value={BoardArticleCategory.RECOMMEND}>
                Recommendation
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box component={"div"} className="wa-title-field">
          <Typography variant="h3">Title</Typography>
          <TextField
            value={articleTitle}
            onChange={articleTitleHandler}
            id="filled-basic"
            label="Type Title"
          />
        </Box>
        <Box component={"div"} className="wa-cover-field">
          <Typography variant="h3">Cover Image</Typography>
          <input
            ref={coverImageRef}
            type="file"
            accept="image/*"
            hidden
            onChange={uploadCoverImageHandler}
          />
          <Box
            className="wa-cover-preview"
            onClick={() => coverImageRef.current?.click()}
            style={{
              backgroundImage: coverImagePreview
                ? `url(${coverImagePreview})`
                : "none",
            }}
          >
            {!coverImagePreview && (
              <span className="wa-cover-placeholder">+ Upload Cover</span>
            )}
          </Box>
        </Box>
      </Stack>

      <Editor
        initialValue={""}
        placeholder={"Type here"}
        previewStyle={"vertical"}
        height={"640px"}
        initialEditType={"wysiwyg"}
        theme="dark"
        toolbarItems={[
          ["heading", "bold", "italic", "strike"],
          ["image", "table", "link"],
          ["ul", "ol", "task"],
        ]}
        ref={editorRef}
        hooks={{
          addImageBlobHook: async (image: any, callback: any) => {
            const uploadedImageURL = await uploadImage(image);
            callback(uploadedImageURL);
            return false;
          },
        }}
        events={{
          load: function (param: any) {},
        }}
      />

      <Stack direction="row" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          style={{ margin: "30px", width: "250px", height: "45px" }}
          onClick={handleRegisterButton}
          disabled={doDisabledCheck()}
        >
          {publishing ? "Publishing..." : "Register"}
        </Button>
      </Stack>
    </Stack>
  );
};

export default TuiEditor;

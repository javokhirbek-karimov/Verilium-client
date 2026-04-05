import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, MenuItem, Select, Stack, Typography } from "@mui/material";
import { BoardArticleCategory } from "../../enums/board-article.enum";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { getJwtToken } from "../../auth";
import { REACT_APP_API_URL } from "../../config";
import { useRouter } from "next/router";
import axios from "axios";
import { CREATE_BOARD_ARTICLE } from "../../../apollo/user/mutation";
import { useMutation } from "@apollo/client";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../sonner";
import { Message } from "../../enums/common.enum";

const TuiEditor = () => {
  const editorRef = useRef<Editor>(null);
  const token = getJwtToken();
  const router = useRouter();
  const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(
    BoardArticleCategory.FREE,
  );

  /** APOLLO REQUESTS **/
  const [createBoardArticle] = useMutation(CREATE_BOARD_ARTICLE);

  // Force WYSIWYG mode after mount (editor sometimes defaults to markdown)
  useEffect(() => {
    const instance = editorRef.current?.getInstance();
    if (instance && instance.isMarkdownMode()) {
      instance.changeMode("wysiwyg");
    }
  }, []);

  const memoizedValues = useMemo(() => {
    return { articleTitle: "", articleContent: "", articleImage: "" };
  }, []);

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
          variables: { file: null, target: "article" },
        }),
      );
      formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
      formData.append("0", image);

      const response = await axios.post(
        `${process.env.REACT_APP_API_GRAPHQL_URL}`,
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

  const handleRegisterButton = async () => {
    try {
      const articleContent = editorRef.current?.getInstance().getHTML() ?? "";
      memoizedValues.articleContent = articleContent;

      if (!memoizedValues.articleContent || !memoizedValues.articleTitle) {
        throw new Error(Message.INSERT_ALL_INPUTS);
      }

      await createBoardArticle({
        variables: {
          input: { ...memoizedValues, articleCategory },
        },
      });

      await sweetTopSuccessAlert("Article created successfully!", 700);
      await router.push({
        pathname: "/mypage",
        query: { category: "myArticles" },
      });
    } catch (err: any) {
      sweetErrorHandling(new Error(Message.INSERT_ALL_INPUTS)).then();
    }
  };

  return (
    <Stack className="tui-editor-wrap">
      {/* ── Meta row: Category + Title ──────────────────────────── */}
      <Stack className="meta-row">
        <Stack className="meta-field">
          <Typography className="meta-label">Category</Typography>
          <Select
            className="meta-select"
            value={articleCategory}
            onChange={(e) =>
              setArticleCategory(e.target.value as BoardArticleCategory)
            }
            displayEmpty
          >
            <MenuItem value={BoardArticleCategory.FREE}>Free Board</MenuItem>
            <MenuItem value={BoardArticleCategory.RECOMMEND}>
              Recommend
            </MenuItem>
            <MenuItem value={BoardArticleCategory.NEWS}>News</MenuItem>
            <MenuItem value={BoardArticleCategory.HUMOR}>Humor</MenuItem>
          </Select>
        </Stack>

        <Stack className="meta-field title-field">
          <Typography className="meta-label">Title</Typography>
          <input
            className="meta-input"
            placeholder="Enter article title..."
            onChange={(e) => {
              memoizedValues.articleTitle = e.target.value;
            }}
          />
        </Stack>
      </Stack>

      <Stack className="editor-box">
        <Editor
          initialValue={""}
          placeholder={"Share your fragrance story..."}
          previewStyle={"tab"}
          height={"520px"}  
          initialEditType={"wysiwyg"}
          toolbarItems={[
            ["heading", "bold", "italic", "strike"],
            ["image", "table", "link"],
            ["ul", "ol", "task"],
          ]}
          ref={editorRef}
          hooks={{
            addImageBlobHook: async (image: any, callback: any) => {
              const url = await uploadImage(image);
              callback(url);
              return false;
            },
          }}
          events={{ load: () => {} }}
        />
      </Stack>

      <Stack className="editor-footer">
        <Button className="publish-btn" onClick={handleRegisterButton}>
          <Typography>Publish Article</Typography>
        </Button>
      </Stack>
    </Stack>
  );
};

export default TuiEditor;

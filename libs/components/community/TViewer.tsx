import React from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Viewer } from "@toast-ui/react-editor";
import { Box, CircularProgress } from "@mui/material";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const TViewer = ({ markdown, className }: { markdown?: string; className?: string }) => {
  if (!markdown) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box className={`tviewer-wrap ${className ?? ""}`}>
      <ErrorBoundary fallback={<pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{markdown}</pre>}>
        <Viewer initialValue={markdown} />
      </ErrorBoundary>
    </Box>
  );
};

export default TViewer;

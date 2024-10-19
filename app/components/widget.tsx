import { useEffect, useRef, ReactNode } from "react";

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface UploadWidgetProps {
  env: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_UPLOAD_PRESET: string;
  };
  children: (params: {
    cloudinary: any;
    widget: any;
    open: () => void;
  }) => ReactNode;
  onUpload: (error: any, result: any, widget: any) => void;
}

let cloudinary: any;
function UploadWidget({ env, children, onUpload }: UploadWidgetProps) {
  const widget = useRef<any>();

  useEffect(() => {
    if (!cloudinary) {
      cloudinary = window.cloudinary;
    }

    function onIdle() {
      if (!widget.current) {
        widget.current = createWidget();
      }
    }

    "requestIdleCallback" in window
      ? requestIdleCallback(onIdle)
      : setTimeout(onIdle, 1);

    return () => {
      widget.current?.destroy();
      widget.current = undefined;
    };
  }, []);

  function createWidget() {
    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.warn(`Ensure cloudName and uploadPreset are provided.`);
    }

    const options = {
      cloudName,
      uploadPreset,
    };

    return cloudinary.createUploadWidget(options, (error: any, result: any) => {
      if (
        (error || result.event === "success") &&
        typeof onUpload === "function"
      ) {
        onUpload(error, result, widget.current);
      }
    });
  }

  function open() {
    if (!widget.current) {
      widget.current = createWidget();
    }

    widget.current && widget.current.open();
  }

  return children({
    cloudinary,
    widget,
    open,
  });
}

export default UploadWidget;

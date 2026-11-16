import { forwardRef, useState } from "react";

const ResponsiveImage = forwardRef(function ResponsiveImage(
  {
    src,
    mobileImage,
    pictureClassName,
    onError,
    ...imageProps
  },
  ref,
) {
  const [failedMobileImage, setFailedMobileImage] = useState(null);
  const useMobileImage = mobileImage && mobileImage !== failedMobileImage;

  function handleError(event) {
    const image = event.currentTarget;
    if (useMobileImage && image.currentSrc.endsWith(mobileImage)) {
      setFailedMobileImage(mobileImage);
      return;
    }
    onError?.(event);
  }

  return (
    <picture className={pictureClassName}>
      {useMobileImage ? (
        <source media="(max-width: 768px)" srcSet={mobileImage} />
      ) : null}
      <img {...imageProps} ref={ref} src={src || undefined} onError={handleError} />
    </picture>
  );
});

export default ResponsiveImage;

export default function HomeImage({ mobileImage: _mobileImage, onError, ...imageProps }) {
  return <img {...imageProps} onError={onError} />;
}

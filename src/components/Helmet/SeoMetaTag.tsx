import { Helmet } from "react-helmet-async";

interface metaType {
  title: string;
  description: string;
}
const SeoMetaTag = (props: metaType) => {
  return (
    <Helmet>
      <title>{props.title}</title>
      <meta name="discripton" content={props.description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={props.title} />
      <meta property="og:site_name" content={props.title} />
      <meta property="og:description" content={props.description} />
    </Helmet>
  );
};
export default SeoMetaTag;

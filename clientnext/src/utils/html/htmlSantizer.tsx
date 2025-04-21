import DOMPurify from "dompurify";

export const HtmlRenderer = ({ htmlString } : {htmlString: string})  => {
    const sanitizedHtmlString = DOMPurify.sanitize(htmlString);
  
    return (
      <div dangerouslySetInnerHTML={{ __html: sanitizedHtmlString }} />
    );
    // <HtmlRenderer htmlString={rendered || "<h1>Sam Altman</h1>"} />
};


export const sanitizeHtml = ({ htmlString } : {htmlString: string}) : string => {
    const sanitizedHtmlString = DOMPurify.sanitize(htmlString);
  
    return sanitizedHtmlString
};


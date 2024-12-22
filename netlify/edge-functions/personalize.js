import { HTMLRewriter } from "https://ghuc.cc/worker-tools/html-rewriter/index.ts";
import { fetchConnectData } from "../../utilities/connect.js";

export default async (request, context) => {
    const url = new URL(request.url);
    const response = await context.next();
    const location = context?.geo?.city;

    if (url.searchParams.get("method") === "personalize") {
        const rewriter = new HTMLRewriter()
            .on("#netlify-title", {
                element: (element) => {
                    if (location) {
                        element.setInnerContent(`Hello from Netlify! How's the weather in ${location}?`);
                    } else {
                        element.setInnerContent(`Hello from Netlify!`);
                    }
                },
            })

        return rewriter.transform(response);
    } else if (url.searchParams.get("method") === "connect") {

        const data = await fetchConnectData();
        console.log(data);

        const rewriter = new HTMLRewriter()
            .on("#netlify-title", {
                element: (element) => {
                    if (location) {
                        element.setInnerContent(`${data.title}?`);
                        element.setAttribute("data-sb-object-id", data._objectId);
                        element.setAttribute("data-sb-field-path", ".title");
                    } else {
                        element.setInnerContent(`Hello from Netlify!`);
                    }
                },
            })

        return rewriter.transform(response);
    } else if (url.searchParams.get("method") === "imgreplace") {
        const rewriter = new HTMLRewriter()
            .on(".netlify-img", {
                element: (element) => {
                    const width = element.getAttribute("width") ?? 800;
                    const height = element.getAttribute("height") ?? 600;
                    element.setAttribute(
                        "src",
                        `https://placehold.co/${width}x${height}?text=Hello+Belk`
                    );
                    element.setAttribute("alt", "A random cat");
                }
            })

        return rewriter.transform(response);
    }


    return response;
};

export const config = {
    path: "/",
};


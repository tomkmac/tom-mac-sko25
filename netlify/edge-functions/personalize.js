import { HTMLRewriter } from "https://ghuc.cc/worker-tools/html-rewriter/index.ts";

export default async (request, context) => {
    const url = new URL(request.url);
    const response = await context.next();
    const location = context?.geo?.city;

    if (url.searchParams.get("method") === "personalize") {
        const rewriter = new HTMLRewriter()
            .on("#netlify-title", {
                element: (element) => {
                    if (location) {
                        element.setInnerContent(`The More You Know (About Tom) while you sit in ${location}...`);
                    } else {
                        element.setInnerContent(`The More You Know (About Tom)`);
                    }
                },
            })

        return rewriter.transform(response);
    }

    return response;
};

export const config = {
    path: "/",
};


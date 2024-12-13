import { revalidateTag } from "next/cache";

const apiHost = "http://localhost:4000";

type PostRoutesPayload = {
  name: string;
  originId: string;
  destinationId: string;
};

export async function fetchPostRoutes(payload: PostRoutesPayload) {
  return fetch(`${apiHost}/routes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((response) => {
    revalidateTag("routes");
    return response;
  });
}

export async function fetchGetRoutes() {
  return fetch(`${apiHost}/routes`, {
    cache: "force-cache",
    next: {
      // revalidate: 60 * 60 * 24, // 1 dia
      tags: ["routes"], // revalidação por demanda
    },
  });
}

export async function fetchGetPlaces(text: string) {
  return fetch(`${apiHost}/places?text=${text}`, {
    // cache: "force-cache",
    // next: {
    //   revalidate: 60 * 60 * 24, // 1 dia
    // },
  });
}

export async function fetchGetDirections(
  originId: string,
  destinationId: string
) {
  return fetch(
    `${apiHost}/directions?originId=${originId}&destinationId=${destinationId}`,
    {
      // cache: "force-cache",
      // next: {
      //   revalidate: 60 * 60 * 24, // 1 dia
      // },
    }
  );
}

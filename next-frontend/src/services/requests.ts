import { revalidateTag } from "next/cache";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type PostRoutesPayload = {
  name: string;
  originId: string;
  destinationId: string;
};

export async function fetchPostRoutes(payload: PostRoutesPayload) {
  return fetch(`${apiUrl}/routes`, {
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
  return fetch(`${apiUrl}/routes`, {
    cache: "force-cache",
    next: {
      // revalidate: 60 * 60 * 24, // 1 dia
      tags: ["routes"], // revalidação por demanda
    },
  });
}

export async function fetchGetRoute(routeId: string) {
  return fetch(`${apiUrl}/routes/${routeId}`, {
    cache: "force-cache",
    next: {
      // revalidate: 60 * 60 * 24, // 1 dia
      tags: [`routes-${routeId}`, "routes"], // revalidação por demanda
    },
  });
}

export async function fetchGetPlaces(text: string) {
  return fetch(`${apiUrl}/places?text=${text}`, {
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
    `${apiUrl}/directions?originId=${originId}&destinationId=${destinationId}`,
    {
      // cache: "force-cache",
      // next: {
      //   revalidate: 60 * 60 * 24, // 1 dia
      // },
    }
  );
}

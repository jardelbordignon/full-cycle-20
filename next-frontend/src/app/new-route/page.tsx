import { searchDirections } from "./logic/functions";
import { NewRouteForm } from "./components/new-route-form";
import { NewRouteMap } from "./components/new-route-map";

type Props = {
  searchParams: Promise<{
    origin: string;
    destination: string;
  }>;
};

export default async function NewRoute({ searchParams }: Props) {
  const { origin, destination } = await searchParams;

  let directionData = null;
  let placeOriginId = null;
  let placeDestinationId = null;

  if (origin && destination) {
    const result = await searchDirections(origin, destination);

    if (result) {
      directionData = result.directionsData;
      placeOriginId = result.placeOriginId;
      placeDestinationId = result.placeDestinationId;
    }
  }

  const leg = directionData ? directionData.routes[0].legs[0] : null;

  return (
    <div className="flex flex-1 w-full h-full">
      <div className="w-1/3 p-4 h-full">
        <h4 className="text-3xl text-contrast mb-2">Nova rota</h4>
        <form className="flex flex-col space-y-4" method="get">
          <div className="relative">
            <input
              id="origin"
              name="origin"
              type="search"
              placeholder=""
              defaultValue={origin}
              className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-contrast bg-default border-0 border-b-2 border-contrast appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
            />
            <label
              htmlFor="origin"
              className="absolute text-contrast duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] start-2.5 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Origem
            </label>
          </div>
          <div className="relative">
            <input
              id="destination"
              name="destination"
              type="search"
              placeholder=""
              defaultValue={destination}
              className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-contrast bg-default border-0 border-b-2 border-contrast appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
            />
            <label
              htmlFor="destination"
              className="absolute text-contrast duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] start-2.5 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Destino
            </label>
          </div>
          <button
            type="submit"
            className="bg-main text-primary p-2 rounded text-xl font-bold"
          >
            Pesquisar
          </button>
        </form>

        {leg && (
          <div className="mt-4 p-4 border rounded text-contrast">
            <ul>
              <li className="mb-2">
                <strong>Origem:</strong> {leg.start_address}
              </li>
              <li className="mb-2">
                <strong>Destino:</strong> {leg.end_address}
              </li>
              <li className="mb-2">
                <strong>Distância:</strong> {leg.distance.text}
              </li>
              <li className="mb-2">
                <strong>Duração:</strong> {leg.duration.text}
              </li>
            </ul>
            <NewRouteForm>
              <input type="hidden" name="originId" value={placeOriginId} />
              <input
                type="hidden"
                name="destinationId"
                value={placeDestinationId}
              />
              <button
                type="submit"
                className="bg-main text-primary font-bold p-2 rounded mt-4"
              >
                Adicionar rota
              </button>
            </NewRouteForm>
          </div>
        )}
      </div>
      <NewRouteMap directionsData={directionData} />
    </div>
  );
}

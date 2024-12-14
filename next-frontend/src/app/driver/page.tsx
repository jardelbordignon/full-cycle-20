import { fetchGetRoutes } from "@/services/requests";
import { DriverMap } from "./components/driver-map";
import type { RouteModel } from "@/utils/models";

type Props = {
  searchParams: Promise<{
    routeId: string | null;
  }>;
};

export default async function Driver({ searchParams }: Props) {
  const { routeId } = await searchParams;

  const getRoutesResponse = await fetchGetRoutes();
  const routes = await getRoutesResponse.json();

  return (
    <div className="flex flex-1 w-full h-full">
      <div className="w-1/3 p-2 h-full">
        <h4 className="text-3xl text-contrast mb-2">Inicie uma rota</h4>
        <div className="flex flex-col">
          <form className="flex flex-col space-y-4" method="get">
            <select
              name="routeId"
              className="mb-2 p-2 border rounded bg-default text-contrast"
            >
              {routes.map((route: RouteModel) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>
            <button
              className="bg-main text-primary p-2 rounded text-xl font-bold"
              style={{ width: "100%" }}
            >
              Iniciar a viagem
            </button>
          </form>
        </div>
      </div>
      <DriverMap routeId={routeId} />
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { getSearchHeroesAction } from "../actions/get-search-hero.action";

//si mi Queryfuncion recibe parametros, siempre los tengo que mandar en el queryKey
export const useSearchHero = (
  name: string,
  team: string,
  category: string,
  universe: string,
  status: string,
  strength: string
) => {
  return useQuery({
    queryKey: ["search", {name, team, category, universe, status, strength}],
    queryFn: () =>
      getSearchHeroesAction({name, team, category, universe, status, strength}),
    staleTime: 1000 * 60 * 5, //5 min
  });
};

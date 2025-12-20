import { CustomJumbotron } from '@/components/custom/CustomJumbotron';
import { HeroStats } from '@/heroes/components/HeroStats';
import { SearchControls } from './ui/SearchControls';
import { CustomBreadcrumbs } from '@/components/custom/CustomBreadCrumb';
import { useSearchHero } from '@/heroes/hooks/useSearchHero';
import { useSearchParams } from 'react-router';
import { HeroGrid } from '@/heroes/components/HeroGrid';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  
  
  //queryparams
  const name = searchParams.get("name") ?? undefined;
  const team = searchParams.get("team") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const universe = searchParams.get("universe") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const strength = searchParams.get("strength") ?? undefined;

  const { data: hero = [] } = useSearchHero(name, team, category, universe, status, strength);

  return (
    <>
      <CustomJumbotron
        title="Búsqueda de SuperHéroes"
        description="Descubre, explora y administra super héroes y villanos"
      />

      <CustomBreadcrumbs
        currentPage="Buscador de héroes"
      />

      {/* Stats Dashboard */}
      <HeroStats />

      {/* Filter and search */}
      <SearchControls />
      <HeroGrid heroes={hero}/>
    </>
  );
};

export default SearchPage;

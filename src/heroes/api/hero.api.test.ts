import {describe, expect, test} from 'vitest';
 //1ero-tomamos el sujero de prueba (heroApi, en este caso)
import { heroApi } from './hero.api';

const BASE_URL = import.meta.env.VITE_API_URL;


describe('HeroApi', ()=>{
    test('Should be configure pointing to the testing server', ()=> {
       
        // console.log(heroApi.defaults.baseURL);
        expect(heroApi).toBeDefined();
        expect(heroApi.defaults.baseURL).toBe(`${BASE_URL}/api/heroes`);
        //supongo que el testing server debe tener el puerto 3001
        expect(BASE_URL).toContain('3001');
    });
});
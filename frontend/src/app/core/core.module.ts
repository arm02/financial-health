import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { HttpProvider } from './helpers/provider/repository.provider';

// const DATA_SERVICES: Provider[] = MockHttpProvider;
const DATA_SERVICES: Provider[] = HttpProvider;
export const NB_CORE_PROVIDERS = [...DATA_SERVICES];

export const CORE_PROVIDERS = [...NB_CORE_PROVIDERS];

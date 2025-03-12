import { SetMetadata } from '@nestjs/common';

export const PUBLIC_ROUTE_META_KEY = '__public_route_meta_key';
export const PublicRoute = () => SetMetadata(PUBLIC_ROUTE_META_KEY, true);

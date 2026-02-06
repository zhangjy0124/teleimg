import { errorHandling, telemetryData } from '../utils/middleware';

// Keep consistent with other folders (functions/api, functions/file)
export const onRequest = [errorHandling, telemetryData];

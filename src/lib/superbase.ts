import { createClient } from '@superbase/superbase-js';

const superbaseUrl = import.meta.env.VITE_SUPERBASE_URL!;
const superbaseAnonKey = import.meta.env.VITE_SUPERBASE_ANON_KEY!;

const superbase = createClient(superbaseUrl, superbaseAnonKey);

export default superbase;

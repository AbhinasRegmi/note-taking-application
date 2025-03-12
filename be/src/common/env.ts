import { configDotenv } from "dotenv"; 

configDotenv();

export function env<T>(name: string, value: T = undefined){
  const envValue = process.env[name] ?? value;
  
  if(!envValue){
    throw new Error(`Cannot resolve the value for config ${name}`);
  }
  
  return envValue;
}

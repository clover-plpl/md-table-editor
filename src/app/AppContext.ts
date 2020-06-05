import { IAppContext } from "../interfaces/IAppContext";


export let AppContext: IAppContext;

export function setAppContext(context: IAppContext)
{
	AppContext = context;
}





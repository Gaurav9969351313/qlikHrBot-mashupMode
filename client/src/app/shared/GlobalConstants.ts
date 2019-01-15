import { Dictonary, IKeyedCollection } from "../shared/utilities";

export class GlobalConstants {

    public static dictAppSettingsMaster: IKeyedCollection<string> = new Dictonary<string>();
    public static arrMenuLevelConfig: any;

    public static arrFirstLevelMenu:any = [];
    public static arrSecondLevelMenu:any = [];
    public static arrThirdLevelMenu:any = [];
    
    public static arrSelectionConfig: any=[];

    public static docLevelMethodHandle: any;
    public static objWss: any;
    public static voices: any;
    public static selectedVoiceConfiguration = 0;

}
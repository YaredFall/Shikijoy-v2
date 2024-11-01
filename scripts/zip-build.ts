import pckg from "../package.json";
import AdmZip from "adm-zip";
import { format } from "date-fns";


const fileName = `v${pckg.version}@${format(new Date(), "dd.MM.yyyy")}.zip`;

const zip = new AdmZip();

zip.addLocalFolder("./dist");
zip.writeZip(`./builds/${fileName}`);
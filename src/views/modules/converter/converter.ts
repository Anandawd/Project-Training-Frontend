import { Options, Vue } from "vue-class-component";
import { v4 as uuid } from "uuid";
import EncryptionHelper from "@/utils/crypto";

const encryptionHelper = new EncryptionHelper();

@Options({
  components: {},
})
export default class Converter extends Vue {
  public source: string = "";
  public dataTableSource: any[] = [];
  public result: string = "";

  plainText = "";
  encryptedText = "";
  salt: string = "";

  handleConvert() {
    // <Text>[frxDBDatasetCheck.TotalPayment]</Text>;
    // var mySubString = this.source.substring(
    //   this.source.indexOf("<Text>") + 1,
    //   this.source.lastIndexOf("</Text>")
    // );
    // console.log(mySubString);
    const text = this.source; //"<Text>[frxDBDatasetCheck.TotalPayment]</Text>";
    const regex = /<Text>(.*?)<\/Text>/g;
    const regex2 = /\[(.*?)\]/g;
    const regex3 = /frxDBDataset(.*?)\./g;
    const matches = text.matchAll(regex);

    const extractedStrings1: any = [];
    const dataTableSource: any[] = [];
    const extractedStrings3: any = [];
    const extractedStrings4: any = [];

    // for (const match of matches) {

    // const matches2 = text.matchAll(regex);
    // for (const match2 of matches2) {
    //dataTableSource
    const matches3 = text.matchAll(regex3);
    for (const match3 of matches3) {
      console.log(match3[1]);
      if (!dataTableSource.includes(match3[1].toString())) {
        dataTableSource.push(match3[1]);
        this.result.push(match3[1]);
        console.log(match3[0]);
      }
    }
    // }
    console.log(dataTableSource);

    // let str = match[1].split("[").pop().split("]")[0]; // returns 'two'
    // extractedStrings.push(str);
    // }

    // console.log(extractedStrings); // p
  }

  handleConvert2() {
    this.dataTableSource = [];
    const input = this.source;
    const regex = /frxDBDataset(\w+)\.(.\w+"|.\w+)/g;
    const matches = input.matchAll(regex);
    const results: Array<[string, string]> = [];
    const dataTableSource: any = {};

    for (const match of matches) {
      console.log(match);
      if (match[2].includes('"')) {
        match[2] = match[2].replaceAll('"', ``);
      }
      console.log(match);
      const datasetName = match[1];
      const fieldName = match[2];

      if (!dataTableSource.hasOwnProperty(datasetName)) {
        dataTableSource[datasetName] = [];
      }

      if (dataTableSource.hasOwnProperty(datasetName)) {
        if (!dataTableSource[datasetName].includes(fieldName)) {
          dataTableSource[datasetName].push(fieldName);
        }
      }
      results.push([datasetName, fieldName]);
    }
    let refNumber = 10000;
    for (const i in dataTableSource) {
      this.template(i, dataTableSource[i], refNumber++);
    }
    this.addDataSourceToTemplate();
    this.regenerateRefIndex();
  }

  template(name: string, columns: Array<[string]>, refNumber: number) {
    var templateDataTableStart = `<root_${name} Ref="${refNumber}" type="DataTableSource" isKey="true">
        <Alias>root_${name}</Alias>
        <Columns isList="true" count="${columns.length}">`;
    var templateDataTableEnd = `  </Columns>
        <Dictionary isRef="1" />
        <Key>${uuid()}</Key>
        <Name>root_${name}</Name>
        <NameInSource>json.${name}</NameInSource>
      </root_${name}>`;

    let columnString = "";
    for (const i of columns) {
      columnString += `   <value>${i},System.String</value>\n`;
    }
    const result = templateDataTableStart + columnString + templateDataTableEnd;
    this.dataTableSource.push(result);
  }

  addDataSourceToTemplate() {
    const text = this.source;
    let dataTableSourceString = "";
    for (const i of this.dataTableSource) {
      dataTableSourceString += i;
    }
    let replace = text.replaceAll(
      '<DataSources isList="true" count="0" />',
      `<DataSources isList="true" count="${this.dataTableSource.length}">
      ${dataTableSourceString}
      </DataSources>`
    );
    console.log(dataTableSourceString);
    this.result = replace;
  }

  regenerateRefIndex() {
    const regex = / Ref="(\d+)"/g;
    let count = 1;
    const text = this.result;
    const regex2 = /\[(.*?)\]/g;
    const regex3 = /frxDBDataset(.*?)/g;
    const regex4 = /\.\"(\w+)\"/g;
    const regex5 = /\&lt\;(.*?)\&gt\;/g; // parse;
    const regex6 = /(\w+)\.(\w+).\#n\%2\,(.*?)n/g;
    const regex7 = /SUM\(/g;
    const regex9 = /AVG\(/g;
    const regex10 = /COUNT\(/g;
    const regex8 = /,MasterData\d/g;
    const regex11 = /, MasterData\d/g;
    //format date
    const regex12 = /(.*){(.*)#ddd\/mm\/yyyy(.*)/g;
    //format time
    const regex13 = /(.*){(.*)#dhh:mm(.*)/g;
    const regex16 = /(.*){(.*)#dhh:mm:ss(.*)/g;
    const regex17 = /Format\((.*)(\,| )Date(\)| )\)/g;
    //variable type date
    const regex14 =
      /(.*)(arrival|Arrival|Departure|departure|birth_date),System\.String(.*)/g;
    //variable type decimal
    const regex15 =
      /(.*)(Weekday.*|Weekend.*|weekend.*|weekday.*|.*Amount.*|.*amount.*),System\.String(.*)/g;

    const replacedText = text.replaceAll(regex, "{$1.$2}");
    // <Text>{SUM(&lt;CheckTransaction."quantity"&gt;*&lt;CheckTransaction."price_original"&gt;, MasterData1)}</Text>
    this.result = text
      .replaceAll(regex8, "")
      .replaceAll(regex11, "")
      .replaceAll(
        "Printed: [Date] [Time #dhh:mm:ss]",
        'Printed: {Format("{0:dd/MM/yyyy hh:mm:ss}",Time)}'
      )
      // .replaceAll(regex, (_, num) => ` Ref="${count++}"`)
      .replaceAll(regex2, "{$1}")
      .replaceAll(regex3, "root_$1")
      .replaceAll(regex4, ".$1")
      .replaceAll(regex5, "decimal.Parse($1)")
      .replaceAll(regex6, 'Format("{0:N2}",decimal.Parse($1.$2))')
      .replaceAll(regex7, "Sum(")
      .replaceAll(regex9, "Avg(")
      .replaceAll(regex10, "Count(")
      .replaceAll(regex12, '$1{Format("{0:dd/MM/yyyy}", $2)$3')
      .replaceAll(regex16, '$1{Format("{0:hh:mm:ss}", $2)$3')
      .replaceAll(regex13, '$1{Format("{0:hh:mm}", $2)$3')
      .replaceAll(regex14, "$1$2,System.Date$3")
      .replaceAll(regex15, "$1$2,System.Decimal$3")
      .replaceAll(regex17, "Format($1$2 Today)")
      .replaceAll("&gt;", ">")
      .replaceAll("&lt;", "<")
      .replaceAll("<Margins>0,0,0,0</Margins>", "<Margins>2,2,2,2</Margins>")
      .replaceAll("&lt;", "<")
      .replaceAll("<CanGrow>True</CanGrow>", "")
      .replaceAll("<CanShrink>True</CanShrink>", "")
      .replaceAll("insert_by", "created_by")
      .replaceAll("foto", "image_url")
      .replaceAll("user_id", "created_by");
    //format
    //   <TextFormat Ref="58" type="NumberFormat" isKey="true">
    //   <DecimalDigits>0</DecimalDigits>
    //   <DecimalSeparator>,</DecimalSeparator>
    //   <GroupSeparator>.</GroupSeparator>
    //   <NegativePattern>1</NegativePattern>
    //   <UseLocalSetting>False</UseLocalSetting>
    // </TextFormat>
    // Audit: { Format("{0:dd/MM/yyyy}", root_Result_data_captain_order.audit_date); }
    // Audit: [frxDBDatasetCaptainOrder."audit_date" #ddd/mm/yyyy]

    // Printed: {Format("{0:dd/MM/yyyy hh:mm:ss}",Time)}
    // <Text>Printed: [Date] [Time #dhh:mm:ss]</Text>;
  }

  replaceString() {
    const text = this.result;
    this.result = text.replaceAll("frxDBDataset", "");
  }

  async encrypt() {
    this.encryptedText = await encryptionHelper.encrypt(
      this.plainText,
      this.salt
    );
    console.log(this.encryptedText);
  }

  async decrypt() {
    this.encryptedText = await encryptionHelper.decrypt(
      this.plainText,
      this.salt
    );
  }
}

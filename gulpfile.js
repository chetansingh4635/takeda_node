var gulp           = require('gulp');
var through        = require('through2');
var fs             = require('fs');
var rename         = require("gulp-rename");
var markdownpdf    = require("markdown-pdf")

var options = {
  remarkable: {
    html    : true,
    breaks  : true,
    plugins : [ require('remarkable-classy') ],
    syntax  : [ 'footnote', 'sup', 'sub' ]
  }
}

gulp.task('doc',function(){
    fs.createReadStream('apiDoc.json')
    .pipe(through({ objectMode: true, allowHalfOpen: false },
        function (chunk, enc, cb) {
            // var contents = chunk.contents.toString(enc);
            var text = fs.readFileSync('apiDoc.json','utf8');
            var jsonData = JSON.parse(text);

            var configTxt = fs.readFileSync('configs.json','utf8');
            var configData = JSON.parse(configTxt);

            // console.log(jsonData);
            var mdText = configData.appName.toUpperCase()+" API.dev v"+configData.version+" \n\
            =\n\
            `NODE` : 6.x.x  \n\
            `NPM` : 5.x.x  \n\
            `MySQL` : 5.5.58  \n\
            `Base URL`: http://"+configData.baseURL+"  \n\
            `Version` : "+configData.version;
            for(var i=0;i<jsonData.length;i++) {
                jsonData[i]["200"]    = parseJson(jsonData[i]["200"]);
                jsonData[i]["401"]     = parseJson(jsonData[i]["401"]);
                jsonData[i]["header"]  = parseJson(jsonData[i]["header"]);
                jsonData[i].parameters = parseTable(jsonData[i].parameters);

                mdText += "\n\## "+(i+1)+". "+ jsonData[i].name +" \n\
>## `"+ jsonData[i].type +"` */"+ jsonData[i].url +"* \n\
### ***Prameters***\n\
"+ jsonData[i].parameters +"\n\
### ***Description***\n\
"+ jsonData[i].description +"\n\
### ***Request***\n\
`Header` \n\
"+JSON.stringify(jsonData[i]["header"])+"\n\
```\n\
{\n\
    path: \"http://"+configData.baseURL+"/v"+configData.version+"/"+ jsonData[i].url +"\",\n\
    method: \""+ jsonData[i].type +"\",\n\
    contentType: \""+ jsonData[i].contentType +"\"\n\
    data: "+ JSON.stringify(jsonData[i].data, null, "\t") +",\n\
    timeout: "+ jsonData[i].timeout +"\n\
}\n\
```\n\
### ***Response***\n\
`Content-Type` : _"+ jsonData[i].contentType +"_\n\
\n\
`200`\n\
"+jsonData[i]["200"].join('\n')+"\n\
`401`\n\
"+jsonData[i]["401"].join('\n')+" \n\
***\n" ;
            }

        cb(null, mdText) // note we can use the second argument on the callback
                        // to provide data as an alternative to this.push('wut?')
        }
    ))
    .pipe(fs.createWriteStream('apiDoc.txt'));

    gulp.src('apiDoc.txt')
    .pipe(rename("README.md"))
    .pipe(gulp.dest("./"));

    markdownpdf(options)
      .from("README.md")
      .to("README.pdf", function () { console.log("PDF generated") })
});

function parseJson(data){
    for(var k=0;k<data.length;k++){
        data[k] = '```\n'+JSON.stringify(data[k], null, "\t")+'\n```';
    }
    return data;
}

function parseTable(data){
    if(data !== ""){
        var text = "| Parameters       | Optional   | Type       | Default Value | \n\
|---------------:  |-----------:|------------|---------------|";
        for(var k=0;k<data.length;k++){
            text += "\n\| _"+data[k].name+"_       | `"+data[k].optional+"`       | _`"+data[k].type+"`_ | "+data[k].default+"          |";
        }
        text += "\n\|                  |            |            |               |\n";
    }
    else{
        text = "`none`";
    }

    return text;
}

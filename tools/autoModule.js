var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./autoModule.config'));
function build(){
    for(var key in config){
        var module = key,
            subMenus = config[key];
        //创建对应的Service和Controller代码默认文件
        var serviceCode = getServiceCode(module, subMenus);
        var controllerCode = getControllerCode(module, subMenus);
        fs.writeFileSync("../js/services/"+module+"Service.js", serviceCode);
        fs.writeFileSync("../js/controllers/"+module+"Controller.js", controllerCode);
        updateIndexHtml(module);
        updateAppJs(module,subMenus);
        generatorDefaultTemplate(module, subMenus);
    }
}


function getServiceCode(module, subMenus){
    var templates = fs.readFileSync('./service.js').toString();
    var headers = templates.match(/--commonHeader--([\d\D]*)--endCommonHeader--/gm)[0].toString().replace('--commonHeader--','').replace('--endCommonHeader--','');
    var bodies = templates.match(/--factorys--([\d\D]*)--endfactorys--/gm)[0].toString().replace('--endfactorys--','').replace('--factorys--','');
    var htmlBody = [];
    htmlBody.push(headers.replace(/{{module}}/gm,module+"Services"));
    subMenus.forEach(function(subMenu){
        htmlBody.push(bodies.replace(/{{subMenu}}/gm,subMenu).replace(/{{module}}/gm,module+"Services"));
    });
    console.log('自动生成Service代码成功')
    return htmlBody.join('\n');
}

function getControllerCode(module, subMenus){
    var templates = fs.readFileSync('./controller.js').toString();
    var headers = templates.match(/--commonHeader--([\d\D]*)--endCommonHeader--/gm)[0].toString().replace('--commonHeader--','').replace('--endCommonHeader--','');
    var bodies = templates.match(/--factorys--([\d\D]*)--endfactorys--/gm)[0].toString().replace('--endfactorys--','').replace('--factorys--','');
    var htmlBody = [];
    htmlBody.push(headers.replace(/{{module}}/gm,module));
    subMenus.forEach(function(subMenu){
        var subMenuOne = subMenu.toLowerCase().replace('s$','');
        htmlBody.push(bodies.replace(/{{subMenu}}/gm,subMenu).replace(/{{module}}/gm,module).replace(/{{subMenuOne}}/gm,subMenuOne));
    });
    console.log('自动生成Controller代码成功')
    return htmlBody.join('\n');
}

function updateIndexHtml(module){
    var html = fs.readFileSync('../index.html').toString();
    // 如果存在对应的Service嵌入或者Controller嵌入就放弃再次插入代码
    var testCReg = new RegExp(module+'Controller\.js','gm');
    var testSReg = new RegExp(module+'Service\.js','gm');
    //html.match(/Controller\.js/)
    if(testCReg.test(html)){
        console.log('html文件中已经存在对应Controller js 不需要更新');
        return;
    }
    if(testCReg.test(html)){
        console.log('html文件中已经存在对应Service js 不需要更新');
        return;
    }
    var jsCode = [];
    jsCode.push('<script src="js/services/'+module+'Service.js"></script>');
    jsCode.push('<script src="js/controllers/'+module+'Controller.js"></script>');
    console.log(jsCode);
    html = html.replace(/<!--autojs-->/gm,jsCode.join('\n')+'\n<!--autojs-->');
    console.log(html);
    fs.writeFileSync('../index.html',html);
    console.log('更新index.html中文件成功');
}

function updateAppJs(module, subMenus){
    var jsContent = fs.readFileSync('../js/app.js').toString();
    var depends = jsContent.match(/\/\*detectedControllerService\*\/([\d\D]*)\/\*endDetectedControllerService\*\//gm)[0].toString();
    if(depends.indexOf(module+"Servers") < 0){
        newDepends = depends.replace('/*endDetectedControllerService*/',"'"+module+"Services',\n    /*endDetectedControllerService*/");
    }
    if(newDepends.indexOf(module+"Controllers") < 0){
        newDepends = newDepends.replace('/*endDetectedControllerService*/',"'"+module+"Controllers',\n    /*endDetectedControllerService*/");
    }
    jsContent = jsContent.replace(depends,newDepends);
    //console.log('depends', newDepends);
    var detectedRouters  = jsContent.match(/\/\*detectedRouters\*\/([\d\D]*)\/\*endDetectedRouters\*\//gm)[0].toString();
    var newdetectedRouters = detectedRouters;
    console.log(newdetectedRouters);
    subMenus.forEach(function(menu){
        //{name: 'dataentry', subName:'Suppliers'},
        if(detectedRouters.indexOf("{name: '"+module+"', subName:'"+menu+"'}") < 0){
            newdetectedRouters = detectedRouters.replace('/*endDetectedRouters*/',"{name: '"+module+"', subName:'"+menu+"'},\n      /*endDetectedRouters*/");
        }
        
    });
    console.log(newdetectedRouters);
    jsContent = jsContent.replace(detectedRouters,newdetectedRouters);
    console.log('替换app.js完成');
    fs.writeFileSync('../js/app.js', jsContent);
}

function generatorDefaultTemplate(module, subMenus){
    var moduleDir = fs.existsSync('../templates/'+module);
    if(!moduleDir){
        fs.mkdirSync('../templates/'+module);
    }
    subMenus.forEach(function(dir){
        var oodir = '../templates/'+module+"/"+dir.toLowerCase()+"/";
        var hasDir = fs.existsSync('../templates/'+module+"/"+dir.toLowerCase());
        if(!hasDir){
            fs.mkdirSync('../templates/'+module+"/"+dir.toLowerCase());
        }
        var hasCreateFile = fs.existsSync(oodir+"create.html");
        var hasListFile = fs.existsSync(oodir+"list.html");
        if(!hasCreateFile){
            fs.writeFileSync(oodir+"create.html",module+' '+dir+' create.html');
        }
        if(!hasListFile){
            fs.writeFileSync(oodir+"list.html",module+' '+dir+' list.html');
        }
        console.log('html模板路径为/templates/'+module+"/"+dir);
    });

}

build();
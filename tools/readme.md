使用方法

1、需要安装nodejs运行安装环境

2、配置
	编辑autoModule.config文件
	写入对应需要大类英文标示和子类英文标示
	注意：子类的英文标示首个字母大写。
    

3、windows下用nodejs得运行环境进入当前目录运行node autoModule.js

4、MAC下进入目录运行node autoModule.js

5、完成后可以手动更新index.html中得链接地址
	比如子类中有ListUser类，就可以在对应左侧菜单中得a链接地址中写入#/listUser
	这样刷新页面后点击对应链接就可以看到对应页面

程序功能
1.自动修改index.html中得嵌入js代码
2.自动生成对应的service和controller代码，service中得api请求地址需要自行修改
3.自动修改app.js文件中得router路由和依赖模块代码
4.检测并自动生成对应模板目录和模板文件
5.如果仅仅是类似的新增修改和列表功能，并且和之前的基本类似的话，代码生成后只需要写好对应的模板文件就可以正确运行对应功能模块

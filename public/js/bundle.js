!function e(r,i,n){function t(a,o){if(!i[a]){if(!r[a]){var u="function"==typeof require&&require;if(!o&&u)return u(a,!0);if(s)return s(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var f=i[a]={exports:{}};r[a][0].call(f.exports,function(e){var i=r[a][1][e];return t(i?i:e)},f,f.exports,e,r,i,n)}return i[a].exports}for(var s="function"==typeof require&&require,a=0;a<n.length;a++)t(n[a]);return t}({1:[function(e,r,i){var n=io(),t=$("#image").text(),s=$("#username").text();$("form").submit(function(){return n.emit("chat message",$("#m").val()),$("#m").val(""),!1}),n.on("chat message",function(e){$("#messages").append('<li><div class="new_message"><div class="who"><img src="'+t+'"/><div class="username_chat">'+s+'</div> </div><div class="msg">'+e+"</div></div></li>")})},{}]},{},[1]);
<!-- 
PHP code used to call our testSign bash script from the web app. 

Robert Livaudais, February 2018
-->

<?php

// takes in the ajax call and proceeds according to which letter was sent with the POST call...
if(isset($_POST['action']) && !empty($_POST['action'])) {
    $action = $_POST['action'];
    switch($action) {
        case 'a' : a();break;
        case 'b' : b();break;
        case 'c' : c();break;
        case 'd' : d();break;
        case 'e' : e();break;
        case 'f' : f();break;
        case 'g' : g();break;
        case 'h' : h();break;
        case 'i' : i();break;
        case 'j' : j();break;
        case 'k' : k();break;
        case 'l' : l();break;
        case 'm' : m();break;
        case 'n' : n();break;
        case 'o' : o();break;
        case 'p' : p();break;
        case 'q' : q();break;
        case 'r' : r();break;
        case 's' : s();break;
        case 't' : t();break;
        case 'u' : u();break;
        case 'v' : v();break;
        case 'w' : w();break;
        case 'x' : x();break;
        case 'y' : y();break;
        case 'z' : z();break;
    }
}

// each of these simply calls the bash script with the appropriate parameter

function a(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/A');
}

function b(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/B');
}

function c(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/C');
}

function d(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/D');
}

function e(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/E');
}

function f(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/F');
}

function g(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/G');
}

function h(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/H');
}

function i(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/I');
}

function j(){
	shell_exec('sh ../../../dynamic/testSign.sh ../../../alphabet_database/J');
}

function k(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/K');
}

function l(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/L');
}

function m(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/M');
}

function n(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/N');
}

function o(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/O');
}

function p(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/P');
}

function q(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/Q');
}

function r(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/R');
}

function s(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/S');
}

function t(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/T');
}

function u(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/U');
}

function v(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/V');
}

function w(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/W');
}

function x(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/X');
}

function y(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/Y');
}

function z(){
	shell_exec('sh ../../../stable/testSign2.sh ../../../alphabet_database/Z');
}

?>
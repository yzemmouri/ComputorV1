const readline = require('readline');
const cmd = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

cmd.question(`Entrez une equation: `, equation => {
    reduced_form(equation)
    cmd.close()
})

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function msg_err(msg)
{
    console.log("\x1b[31m", '   ====> Syntax Error : ' + msg + '.');
}

function reduced_form(equation)
{
    var edited_equation = equation.replace(/ /g, '')
    if (edited_equation[0] != '-' && edited_equation[0] != '+')
        edited_equation = addStr(edited_equation, 0, '+') /** add '+' in beginig */
    var equal_index = edited_equation.indexOf('=')
    if (edited_equation[equal_index + 1] != '-' && edited_equation[equal_index + 1] != '+')
        edited_equation = addStr(edited_equation, equal_index + 1, '+') /** add '+' after '=' */
    
    if (!isValidPolynom(edited_equation))
    {
        msg_err("incorrect equation format !!");
        return ;
    }
    /** check if more than one indeterminate */
    if (check_indeter(edited_equation) == "error")
    {
        msg_err("incorrect equation format !!");
        return ;
    }
    var splited_by_equal = equation.replace(/ /g, '').split`=`;
    var reduced_form = splited_by_equal[0]
    if (splited_by_equal[1][0] == '+')
        splited_by_equal[1] = splited_by_equal[1].replace('+','');
    if (splited_by_equal[1][0] != '-')
        reduced_form+='-';
    for (var c = 0; c < splited_by_equal[1].length; c++) {
        if (splited_by_equal[1][c] == '-')
            reduced_form += '+'
        else if (splited_by_equal[1][c] == '+')
            reduced_form += '-'
        else
            reduced_form += splited_by_equal[1][c]
    }
    
    var negatif_expressions = [];
    var positif_expressions = [];
    
    if (reduced_form[0] == '+')
        reduced_form = reduced_form.replace('+',''); /** remove plus sign in begning of sentence */

    var splited_by_plus = reduced_form.split`+`
    for(var i = 0; i < splited_by_plus.length; i++){
        tmp_expression = splited_by_plus[i].split`-`
        if(tmp_expression.length == 1)
            positif_expressions.push(tmp_expression[0])
        else
        {
            positif_expressions.push(tmp_expression[0])
            negatif_expressions.push(...tmp_expression.slice(1))
        }
    }
    
    positif_expressions = positif_expressions.filter(e => e); /** Remove Empty Strings from an Array */
    negatif_expressions = negatif_expressions.filter(e => e);
    


    var degree_coeff = []
    var indeterminate = 'x'
    /** Positif expressions */
    for (var i = 0; i < positif_expressions.length; i++)
    {
        var coefficient
        var degree

        var splited_by_times
        var splited_by_exp
        var splited_by_indeter

        splited_by_times = positif_expressions[i].split`*`;
        if (splited_by_times.length == 2)
        {
            coefficient = parseFloat(splited_by_times[0])
            splited_by_exp = splited_by_times[1].split`^`
            if (splited_by_exp.length == 2)
            {
                indeterminate = splited_by_exp[0]
                degree = parseInt(splited_by_exp[1])
            }
            else
            {
                indeterminate = splited_by_exp[0]
                degree = 1
            }
        }
        else
        {
            var indeter_ind = index_indeter(positif_expressions[i])
            if (indeter_ind != -1)
            {
                indeterminate = positif_expressions[i][indeter_ind]
                splited_by_indeter = positif_expressions[i].split(indeterminate)
                if (splited_by_indeter[0] != '')
                    coefficient = parseFloat(splited_by_indeter[0])
                else
                    coefficient = 1;
                if (splited_by_indeter[1] == '')
                    degree = 1
                else
                    degree = parseInt((positif_expressions[i].split`^`)[1])
            }
            else
            {
                coefficient = parseFloat(positif_expressions[i])
                degree = 0;
            }
        }
        
        if (coefficient != 0) {
            var tab = [degree, coefficient]
            if (degree_coeff.length == 0)
                degree_coeff.push(tab)
            else
            {
                var j = 0
                while(j < degree_coeff.length)
                {
                    if(degree_coeff[j][0] == degree)
                    {
                        degree_coeff[j][1] += coefficient
                        break;
                    }
                    j++;
                }
                if (j == degree_coeff.length && degree_coeff[j-1][0] != degree)
                    degree_coeff.push(tab)
            }
        }
    }
    /** Negatif expressions */
    for (var i = 0; i < negatif_expressions.length; i++)
    {
        var coefficient
        var degree
        
        var splited_by_times
        var splited_by_exp
        var splited_by_indeter
        
        splited_by_times = negatif_expressions[i].split`*`;
        if (splited_by_times.length == 2)
        {
            coefficient = parseFloat('-' + splited_by_times[0])
            splited_by_exp = splited_by_times[1].split`^`
            if (splited_by_exp.length == 2)
            {
                indeterminate = splited_by_exp[0]
                degree = parseInt(splited_by_exp[1])
            }
            else
            {
                indeterminate = splited_by_exp[0]
                degree = 1
            }
        }
        else
        {
            var indeter_ind = index_indeter(negatif_expressions[i])
            if (indeter_ind != -1)
            {
                indeterminate = negatif_expressions[i][indeter_ind]
                splited_by_indeter = negatif_expressions[i].split(indeterminate)
                if (splited_by_indeter[0] != '')
                coefficient = parseFloat('-' + splited_by_indeter[0])
                else
                coefficient = -1;
                if (splited_by_indeter[1] == '')
                degree = 1
                else
                degree = parseInt((negatif_expressions[i].split`^`)[1])
            }
            else
            {
                coefficient = parseFloat('-' + negatif_expressions[i])
                degree = 0;
            }
        }
        
        var tab = [degree, coefficient]
        if (degree_coeff.length == 0)
        degree_coeff.push(tab)
        else
        {
            var j = 0
            while(j < degree_coeff.length)
            {
                if(degree_coeff[j][0] == degree)
                {
                    degree_coeff[j][1] += coefficient
                    break;
                }
                j++;
            }
            if (j == degree_coeff.length && degree_coeff[j-1][0] != degree)
            degree_coeff.push(tab)
        }
    }
    degree_coeff.sort(function (a, b) {
        return b[0] - a[0];
    });

    /** Reduced Format */
    var reduced_equation = ''
    var is_null = true
    for (var i = 0; i < degree_coeff.length; i++) {
        var indeter_exp = degree_coeff[i][0] == 0 ? '' : (degree_coeff[i][0] == 1 ? ' * ' + indeterminate.toUpperCase() : ' * '+indeterminate.toUpperCase()+'^' + degree_coeff[i][0])
        if (i == 0)
            reduced_equation += degree_coeff[i][1] == 0 ? '' : degree_coeff[i][1] + indeter_exp;
        else
            reduced_equation += degree_coeff[i][1] == 0 ? '' : (degree_coeff[i][1] < 0 ? ((reduced_equation != '' ? ' ' : '') + '- ' + (degree_coeff[i][1] * -1) + indeter_exp) : (reduced_equation != '' ? ' + ' + degree_coeff[i][1] + indeter_exp : degree_coeff[i][1] + indeter_exp))

        if (degree_coeff[i][1] != 0)
            is_null = false
    }
    if (is_null)
        reduced_equation += '0';
    reduced_equation += ' = 0';
    //console.log(degree_coeff)
    console.log("\x1b[33m",'Reduced form: ' + reduced_equation)

    /** Degree */
    var polynomial_degree = 0;
    for (var i = 0; i < degree_coeff.length; i++)
    {
        if (degree_coeff[i][1] != 0)
        {
            polynomial_degree = degree_coeff[i][0]
            break ;
        }
    }

    console.log("\x1b[34m", 'Polynomial degree: ' + (reduced_equation == '0 = 0' ? "unknown" : polynomial_degree))

    /** Solution */
    var a;
    var b = 0;
    var c = 0;
    if (polynomial_degree > 2)
        console.log("\x1b[32m", 'The polynomial degree is stricly greater than 2, I can\'t solve.');
    else if (polynomial_degree == 2) {
        for (var i = 0; i < degree_coeff.length; i++)
        {
            if (degree_coeff[i][0] == 2)
                a = degree_coeff[i][1]
            if (degree_coeff[i][0] == 1)
                b = degree_coeff[i][1]
            if (degree_coeff[i][0] == 0)
                c = degree_coeff[i][1]
        }
        var delta = (b ** 2) - (4 * a * c)
        if (delta < 0)
            console.log("\x1b[32m",'Discriminant is strictly negative, The equation is ai+b')
        else if (delta == 0)
        {
            console.log("\x1b[32m",'Discriminant is null, The only solution is:\n'+(b / (-2 * a)))
        }
        else {
            var delta_sqrt = _sqrt(delta);
            var r1 = (-b + delta_sqrt) / (2 * a)
            var r2 = (-b - delta_sqrt) / (2 * a)
            console.log("\x1b[32m",'Discriminant is strictly positive, the two solutions are:\n'+r1.toFixed(6) + '\n' + r2.toFixed(6))
        }
    }
    else if (polynomial_degree == 1) {
        for (var i = 0; i < degree_coeff.length; i++)
        {
            if (degree_coeff[i][0] == 1)
                a = degree_coeff[i][1]
        }
        if (degree_coeff.length > 1 && degree_coeff[degree_coeff.length - 1][0] == 0)
            b = degree_coeff[degree_coeff.length - 1][1]
        if (reduced_equation == '0 = 0')
            console.log("\x1b[32m",'the solution is:\nall real numbers are solution.')
        else
            console.log("\x1b[32m",'the solution is:\n' + b / a * -1);
    }
    else if (polynomial_degree == 0) {
        if (reduced_equation == '0 = 0')
            console.log("\x1b[32m",'the solution is:\nall real numbers are solution.')
        else
            console.log("\x1b[32m",'The equation has no solution!')
    }
}

/** Used Function */

function _sqrt(number) {
    var start = 0, end = number;
    var mid;
    var ans;
    while (start <= end) {
        mid = (start + end) / 2;
        if (mid * mid == number) {
            ans = mid;
            break;
        }

        if (mid * mid < number) {
            ans = start;
            start = mid + 1;
        }
        else {
            end = mid - 1;
        }
    }
    var increment = 0.1;
    for (var i = 0; i < 7; i++) {
        while (ans * ans <= number) {
            ans += increment;
        }
        ans = ans - increment;
        increment = increment / 10;
    }
    return ans;
}

function index_indeter(str) {
    var code, i, len;
  
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if ((code > 64 && code < 91) || // upper alpha (A-Z)
          (code > 96 && code < 123)) { // lower alpha (a-z)
        return (i);
      }
    }
    return (-1);
  };

  
  function isValidPolynom(input)
  {
    var   polynomeRegex = /^([+-]([0-9]+(\.[0-9]+)?(\*[a-zA-Z](\^[0-9]+)?|[a-zA-Z](\^[0-9]+)?)?|[a-zA-z](\^[0-9]+)?))+=([+-]([0-9]+(\.[0-9]+)?(\*[a-zA-Z](\^[0-9]+)?|[a-zA-Z](\^[0-9]+)?)?|[a-zA-z](\^[0-9]+)?))+$/g
    return (polynomeRegex.test(input));
  }

  function addStr(str, index, stringToAdd){
    return (str.substring(0, index) + stringToAdd + str.substring(index, str.length));
  }

  function  check_indeter(equation)
  {
    var num_diff = 0;
    var indeter = 'X';
    var i;
    for (i=0; i < equation.length; i++)
    {  
        code = equation.charCodeAt(i);
        if ((code > 64 && code < 91) || // upper alpha (A-Z)
            (code > 96 && code < 123)) { // lower alpha (a-z)
          indeter = equation[i].toUpperCase();
          num_diff++;
          break;
        }
    }
    if (num_diff == 1)
    {
        for (; i < equation.length; i++)
        {
            code = equation.charCodeAt(i);
            if ((code > 64 && code < 91) || // upper alpha (A-Z)
                (code > 96 && code < 123)) { // lower alpha (a-z)
              if (equation[i].toUpperCase() != indeter)
                return ("error")
            }
        }
    }
    return (indeter.toString())
  }
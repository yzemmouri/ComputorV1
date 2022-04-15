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
    var splited_by_equal = equation.replace(/ /g, '').split`=`;
    if (splited_by_equal.length != 2)
    {
        msg_err("miss or many equals sign in sentence");
        return ;
    }
    if (splited_by_equal[0] === '')
    {
        msg_err("empty sentence before equals sign");
        return ;
    }
    var reduced_form = splited_by_equal[0]
    if (splited_by_equal[1] === '')
    {
        msg_err("empty sentence after equals sign");
        return ;
    }
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
    var indeterminate
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
    console.log(positif_expressions);
    console.log(negatif_expressions);
    var reduced_equation = ''
    var is_null = true
    for (var i = 0; i < degree_coeff.length; i++) {
        var indeter_exp = degree_coeff[i][0] == 0 ? '' : (degree_coeff[i][0] == 1 ? ' * X' : ' * X^' + degree_coeff[i][0])
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
    console.log(degree_coeff)
    console.log('Reduced form: ' + reduced_equation)

    /** Degree */

    var polynomial_degree = degree_coeff[0][0]
    console.log('Polynomial degree: ' + polynomial_degree)

    /** Solution */

    if (polynomial_degree > 2)
        console.log('The polynomial degree is stricly greater than 2, I can\'t solve.');
    else if (polynomial_degree == 2) {
        var delta = (((degree_coeff.length >= 2 && degree_coeff[1][0] == 1) ? degree_coeff[1][1] ** 2 : 0) - 4 * degree_coeff[0][1] * ((degree_coeff.length >= 3 && degree_coeff[2][0] == 0) ? degree_coeff[2][1] : 0))
        if (delta < 0)
            console.log('Discriminant is strictly negative, The equation has no solution in R!')
        else if (delta == 0)
            console.log('Discriminant is null, The only solution is:\n' + ((degree_coeff.length >= 2 && degree_coeff[1][0] == 1) ? degree_coeff[1][1] : 0) / (-2 * degree_coeff[0][1]))
        else {
            var delta_sqrt = _sqrt(delta);
            var r1 = (-((degree_coeff.length >= 2 && degree_coeff[1][0] == 1) ? degree_coeff[1][1] : 0) + delta_sqrt) / (2 * degree_coeff[0][1])
            var r2 = (-((degree_coeff.length >= 2 && degree_coeff[1][0] == 1) ? degree_coeff[1][1] : 0) - delta_sqrt) / (2 * degree_coeff[0][1])
            console.log('Discriminant is strictly positive, the two solutions are:\n' + r1.toFixed(6) + '\n' + r2.toFixed(6))
        }
    }
    else if (polynomial_degree == 1) {
        var a = degree_coeff[0][1]
        var b = degree_coeff.length == 2 ? degree_coeff[1][1] : 0
        if (reduced_equation == '0 = 0')
            console.log('the solution is:\nall real numbers are solution.')
        else
            console.log('the solution is:\n' + b / a * -1);
    }
    else if (polynomial_degree == 0) {
        if (reduced_equation == '0 = 0')
            console.log('the solution is:\nall real numbers are solution.')
        else
            console.log('The equation has no solution!')
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
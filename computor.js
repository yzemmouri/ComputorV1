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

function reduced_form(equation)
{
    var splited_form_by_equal = equation.replace(/ /g, '').split`=`;
    var reduced_form = splited_form_by_equal[0]
    if (splited_form_by_equal[1][0] == '+')
        splited_form_by_equal[1].replace('+','');
    if (splited_form_by_equal[1][0] != '-')
        reduced_form+='-';
    for (var c = 0; c < splited_form_by_equal[1].length; c++) {
        if (splited_form_by_equal[1][c] == '-')
            reduced_form += '+'
        else if (splited_form_by_equal[1][c] == '+')
            reduced_form += '-'
        else
            reduced_form += splited_form_by_equal[1][c]
    }
    var splited_form_by_plus = reduced_form.split`+`
    var negatif_coefficients = [];
    var positif_coefficients = [];
    for(var i=0; i<splited_form_by_plus.length; i++){
        coefficients = splited_form_by_plus[i].split`-`
        if(coefficients.length == 1)
            positif_coefficients.push(coefficients[0])
        else
        {
            positif_coefficients.push(coefficients[0])
            negatif_coefficients.push(...coefficients.slice(1))
        }
    }


    var variabl_degree = []
    for(var i=0;i<positif_coefficients.length;i++)
    {
        var degree = parseInt((positif_coefficients[i].split`^`)[1])
        var value = parseInt((positif_coefficients[i].split`*`)[0])
        var tab = [degree, value]
        if (variabl_degree.length == 0)
            variabl_degree.push(tab)
        else
        {
            var j = 0
            while(j<variabl_degree.length)
            {
                if(variabl_degree[j][0] == degree)
                {
                    variabl_degree[j][1] += value
                    break;
                }
                j++;
            }
            if (j == variabl_degree.length && variabl_degree[j-1][0] != degree)
                variabl_degree.push(tab)
        }
    }
    for(var i=0;i<negatif_coefficients.length;i++)
    {
        var degree = parseInt((negatif_coefficients[i].split`^`)[1])
        var value = parseInt('-' + (negatif_coefficients[i].split`*`)[0])
        var tab = [degree, value]
        if (variabl_degree.length == 0)
            variabl_degree.push(tab)
        else
        {
            var j = 0
            while(j<variabl_degree.length)
            {
                if(variabl_degree[j][0] == degree)
                {
                    variabl_degree[j][1] += value
                    break;
                }
                j++;
            }
            if (j == variabl_degree.length && variabl_degree[j-1][0] != degree)
                variabl_degree.push(tab)
        }
    }
    variabl_degree.sort(function (a, b) {
        return b[0] - a[0];
    });


    var reduced_equation = ''
    var is_null = true
    var polynomial_degree = 0
    for (var i = 0; i < variabl_degree.length; i++) {
        if (i == 0)
            reduced_equation += variabl_degree[i][1] == 0 ? '' : variabl_degree[i][1] + ' * X^' + variabl_degree[i][0]
        else if (i != variabl_degree.length - 1) {
            reduced_equation += variabl_degree[i][1] == 0 ? '' : (variabl_degree[i][1] < 0 ? ((reduced_equation != '' ? ' ' : '') + '- ' + (variabl_degree[i][1] * -1) + ' * X^' + variabl_degree[i][0]) : (reduced_equation != '' ? ' + ' + variabl_degree[i][1] + ' * X^' + variabl_degree[i][0] : variabl_degree[i][1] + ' * X^' + variabl_degree[i][0]))
        }
        else
            reduced_equation += variabl_degree[i][1] == 0 ? '' : (variabl_degree[i][1] < 0 ? variabl_degree[i][1] : (reduced_equation != '' ? ' + ' + variabl_degree[i][1] : variabl_degree[i][1]))
        if (variabl_degree[i][1] != 0 && polynomial_degree == 0)
        {
            is_null = false
            polynomial_degree = variabl_degree[i][0]
        }
    }
    if (is_null)
        reduced_equation += '0';
    reduced_equation += ' = 0';

    console.log('Reduced form: ' + reduced_equation)
    console.log('Polynomial degree: ' + polynomial_degree)
}
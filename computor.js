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
    if (splited_form_by_equal[1][0] == '-')
        reduced_form+='+';
    else
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

    var x0 = 0
    var x1 = 0
    var x2 = 0
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
        // if(positif_coefficients[i].includes('X^2'))
        //     x2+=parseInt((positif_coefficients[i].split`*`)[0])
        // if(positif_coefficients[i].includes('X^1'))
        //     x1+=parseInt((positif_coefficients[i].split`*`)[0])
        // if(positif_coefficients[i].includes('X^0'))
        //     x0+=parseInt((positif_coefficients[i].split`*`)[0])
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
        // if(negatif_coefficients[i].includes('X^2'))
        //     x2+=parseInt('-' + (negatif_coefficients[i].split`*`)[0])
        // if(negatif_coefficients[i].includes('X^1'))
        //     x1+=parseInt('-' + (negatif_coefficients[i].split`*`)[0])
        // if(negatif_coefficients[i].includes('X^0'))
        //     x0+=parseInt('-' + (negatif_coefficients[i].split`*`)[0])
    }
    console.log(variabl_degree)
    // var deg2 = x2 == 0 ? '' : x2 + ' * X^2'
    // var deg1 = x1 == 0 ? '' : (x1 < 0 ? x1 + ' * X^1' : (x2 != 0 ? ' + ' + x1 + ' * X^1' : x1 + ' * X^1'))
    // var deg0 = x0 == 0 ? ((x2 != 0 || x1 != 0) ? '' : '0') : (x0 < 0 ? x0 : ((x2 != 0 || x1 != 0) ? ' + ' + x0 : x0))
    // console.log('Reduced form: ' + deg2 + deg1 + deg0 + ' = 0')

    // var polynomial_degree = x2 != 0 ? 2 : (x1 != 0 ? 1 : 0)
    // console.log('Polynomial degree: ' + polynomial_degree)
    //reduced_form+=' = 0'
}
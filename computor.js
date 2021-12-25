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

    if (splited_form_by_equal[1] != '0') {
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
    }

    var negatif_coefficients = [];
    var positif_coefficients = [];

    var splited_form_by_plus = reduced_form.split`+`
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

    filtered_positif_coefficients = positif_coefficients.filter(e => e); /** Remove Empty Strings from an Array */
    filtered_negatif_coefficients = negatif_coefficients.filter(e => e);

    var variabl_degree = [[0, 0]]
    for (var i = 0; i < filtered_positif_coefficients.length; i++)
    {
        var degree = parseInt((filtered_positif_coefficients[i].split`^`)[1])
        var value = parseFloat((filtered_positif_coefficients[i].split`*`)[0])
        var tab = [degree, value]
        if (value != 0) {
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
    }
    for (var i = 0; i < filtered_negatif_coefficients.length; i++)
    {
        var degree = parseInt((filtered_negatif_coefficients[i].split`^`)[1])
        var value = parseFloat('-' + (filtered_negatif_coefficients[i].split`*`)[0])
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

    /** Reduced Format */

    var reduced_equation = ''
    var is_null = true
    for (var i = 0; i < variabl_degree.length; i++) {
        var indeterminate = variabl_degree[i][0] == 0 ? '' : (variabl_degree[i][0] == 1 ? ' * X' : ' * X^' + variabl_degree[i][0])
        if (i == 0)
            reduced_equation += variabl_degree[i][1] == 0 ? '' : variabl_degree[i][1] + indeterminate
        else
            reduced_equation += variabl_degree[i][1] == 0 ? '' : (variabl_degree[i][1] < 0 ? ((reduced_equation != '' ? ' ' : '') + '- ' + (variabl_degree[i][1] * -1) + indeterminate) : (reduced_equation != '' ? ' + ' + variabl_degree[i][1] + indeterminate : variabl_degree[i][1] + indeterminate))

        if (variabl_degree[i][1] != 0)
        {
            is_null = false

        }
    }
    if (is_null)
        reduced_equation += '0';
    reduced_equation += ' = 0';
    console.log(variabl_degree)
    console.log('Reduced form: ' + reduced_equation)

    /** Degree */

    var polynomial_degree = variabl_degree[0][0]
    console.log('Polynomial degree: ' + polynomial_degree)

    /** Solution */

    if (polynomial_degree > 2)
        console.log('The polynomial degree is stricly greater than 2, I can\'t solve.');
    else if (polynomial_degree == 2) {
        var delta = ((variabl_degree.length == 3 ? variabl_degree[1][1] ** 2 : 0) - 4 * variabl_degree[0][1] * variabl_degree[2][1])
        if (delta < 0)
            console.log('Discriminant is strictly negative, The equation has no solution in R!')
        else if (delta == 0)
            console.log('Discriminant is null, The only solution is:\n' + (variabl_degree.length == 3 ? variabl_degree[1][1] ** 2 : 0) / (-2 * variabl_degree[1][0]))
        else {
            var delta_sqrt = _sqrt(delta);
            var r1 = (-(variabl_degree.length == 3 ? variabl_degree[1][1] : 0) + delta_sqrt) / (2 * variabl_degree[0][1])
            var r2 = (-(variabl_degree.length == 3 ? variabl_degree[1][1] : 0) - delta_sqrt) / (2 * variabl_degree[0][1])
            console.log('Discriminant is strictly positive, the two solutions are:\n' + r1.toFixed(6) + '\n' + r2.toFixed(6))
        }
    }
    else if (polynomial_degree == 1) {
        var a = variabl_degree[0][1]
        var b = variabl_degree[1][1]
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

const readline = require('readline');
const cmd = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

cmd.question(`Entrez une equation: `, equation => {
    reduced_form(equation)
    cmd.close()
})

function reduced_form(equation)
{
    var splited_form_by_equal = equation.replace(/ /g, '').split`=`;
    var reduced_form = splited_form_by_equal[0]
    if (splited_form_by_equal[1][0] == '-')
        reduced_form+='+';
    else
        reduced_form+='-';
    reduced_form+=splited_form_by_equal[1]
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

    for(var i=0;i<positif_coefficients.length;i++)
    {
        if(positif_coefficients[i].includes('X^2'))
            x2+=parseInt((positif_coefficients[i].split`*`)[0])
        if(positif_coefficients[i].includes('X^1'))
            x1+=parseInt((positif_coefficients[i].split`*`)[0])
        if(positif_coefficients[i].includes('X^0'))
            x0+=parseInt((positif_coefficients[i].split`*`)[0])
    }
    for(var i=0;i<negatif_coefficients.length;i++)
    {
        if(negatif_coefficients[i].includes('X^2'))
            x2+=parseInt('-' + (negatif_coefficients[i].split`*`)[0])
        if(negatif_coefficients[i].includes('X^1'))
            x1+=parseInt('-' + (negatif_coefficients[i].split`*`)[0])
        if(negatif_coefficients[i].includes('X^0'))
            x0+=parseInt('-' + (negatif_coefficients[i].split`*`)[0])
    }

    console.log('Reduced form: '+x2+' * X^2'+(x1>=0?' + ':' ')+x1+' * X^1'+(x0>=0?' + ':' ')+x0+' * X^0'+' = 0')

    //reduced_form+=' = 0'
}
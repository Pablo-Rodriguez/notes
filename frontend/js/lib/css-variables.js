
function color (vars, name, light, normal, dark) {
  vars[name] = {
    l: light,
    n: normal,
    d: dark
  }
}

const vars = {}

color(vars, 'primary', '#c5e99b', '#8fbc94', '#548687')
color(vars, 'secodary', '#d499b9', '#9055a2', '#56445d')

vars.dark = vars.secondary['d']
vars.light = '#f4f7f7'

export default vars


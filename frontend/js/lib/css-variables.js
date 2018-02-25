
function color (vars, name, light, normal, dark) {
  vars[name] = {
    l: light,
    n: normal,
    d: dark
  }
}

const vars = {
  shadow: {
    up: (pxs) => `0px 0px ${pxs}px rgba(0, 0, 0, 0.3)`,
    side: (pxs) => `1px 1px ${pxs}px rgba(0, 0, 0, 0.3)`
  }
}

color(vars, 'primary', '#c5e99b', '#8fbc94', '#548687')
color(vars, 'secondary', '#d499b9', '#9055a2', '#56445d')

vars.dark = vars.secondary['d']
vars.light = '#f4f7f7'
vars.white = '#fefefe'
vars.error = '#f16b6f'

export default vars



base="./js/components/"

mkdir "$base$1"
echo "
import html from 'choo/html'

import style from './style'

export default (state, emit) => {
  return html\`
    <div class=\${style}></div>
  \`
}
" > "$base$1/$1.js"
echo "
import {css} from 'emotion'

export default css\`
  display: block;
\`
" > "$base$1/style.js"

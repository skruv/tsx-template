import { render } from 'skruv'
import { css, cssTextGenerator } from 'skruv/utils/css.js'
import { createState } from 'skruv/utils/state.js'
import { syncify, hydrationPromise } from 'skruv/utils/syncify.js'

const state = createState({ todos: ['Write todos'] })

const styles = css`
  :scope {
    color: #f1f1f1;
    background: #0f0f0f;
  }

  body {
    max-width: 40ch;
    margin: 0 auto;
  }

  form { display: flex; }
  input { flex: 1; }
  a { color: #9b9b9b; }
`

const doRender = async (): Promise<void> => {
  await hydrationPromise
  render(
    syncify(
      <html lang='en-US' class={styles}>
        <head>
          <title>{state.todos.getGenerator(0)}</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <skruvHeader name='X-Test-Header' value='test' />
          <skruvComment>test</skruvComment>
          <style>{cssTextGenerator}</style>
        </head>
        <body>
          <main>
            <h1>{state.todos.getGenerator(0)}</h1>
            <form onsubmit={e => {
              e.preventDefault()
              const todo = new FormData(e.currentTarget).get('todo')?.toString()
              if (todo !== undefined) state.todos.unshift(todo)
              e.currentTarget.reset()
            }}
            >
              <input name='todo' />
              <button>New!</button>
            </form>
            <ol>
              {async function * () {
                for await (const todos of state.todos) {
                  yield todos.map((todo, i) => (
                    <li>{todo}
                      <a
                        href='#'
                        onclick={e => {
                          e.preventDefault()
                          todos.splice(i, 1)
                        }}
                      >x
                      </a>
                    </li>
                  ))
                }
              }}
            </ol>
          </main>
          <script type='module'>
            {
              // @ts-expect-error this property is not defined in a client environment but used on the server
              globalThis.skruvSSRScript
            }
          </script>
        </body>
      </html>
    )
  )
}

void doRender()

export default doRender



// Get and show rules
export async function showRules() {
    const output = document.getElementById('output');
    // console.log(output)
    let ret = []
    try {
      const res = await fetch('http://localhost:8000/api/rules');
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
  
      const posts = await res.json();
      output.innerHTML = '';
      // console.log(output)

      posts.forEach((post) => {
        // const postEl = document.createElement('div');
        // postEl.textContent = post.contents;
        // output.appendChild(postEl);
        // console.log(post)
        ret.push(post.contents)
        // ret.push(post.contents)
      });
  
    } catch (error) {
      console.log('Error fetching posts: ', error);
    }
    return ret
}

export async function beginProof(e) {
    const ProofWindow = document.querySelector('#ProofWindow');

    e.preventDefault();
    const formData = new FormData(this);

    //has to be named content
    const contents = formData.get('rule');

    //append statement
    let s = document.getElementById("statement");
    if(!s){
      s = document.createElement('div')
      s.id = 'statement'
    }
    s.innerText = 'proving: ' + contents
    ProofWindow.appendChild(s)

    //append start
    let startexp = document.getElementById('start');
    if(!startexp){
      startexp = document.createElement('div')
      startexp.id = 'start'
    }

    let r = checker.genRule(contents + '\n')
    //display start
    startexp.innerText = checker.ExpToString(r.leftexps);
    ProofWindow.appendChild(startexp)
    nextexp(ProofWindow)

}

function nextexp(s){
  const nextexp = document.createElement('form');
  const expInput = document.createElement('input');
  const expBtn = document.createElement('button');
  nextexp.appendChild(expInput)
  nextexp.appendChild(expBtn)
  // if(!checker.Same(rule.leftexps,rule.rightexps))
  // {
  //     //if not same then generate button for checking
  //     
  // }
  s.appendChild(nextexp);
}

export async function addRule(e) {
    const output = document.querySelector('#output');

    e.preventDefault();
    const formData = new FormData(this);

    //has to be named content
    const contents = formData.get('rule');
    try {
        const res = await fetch('http://localhost:8000/api/rules', {
        method: 'POST',
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({ contents }),
        });

        if (!res.ok) {
        throw new Error('Failed to add post');
        }

        const newPost = await res.json();

        const postEl = document.createElement('div');
        postEl.textContent = newPost[0].contents;

        output.appendChild(postEl);
    } catch (error) {
        console.error('Error adding rule');
    }
}

import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

socket.connect()

const createSocket = (topicId) => {
  let channel = socket.channel(`comments:${topicId}`, {})
  channel.join()
    .receive("ok", resp => {
      renderComments(resp.comments);
    })
    .receive("error", resp => { console.log("Unable to join", resp) })

  channel.on(`comments:${topicId}:new`, event => {
    renderComment(event.comment)
  });

  document.querySelector('button#sendComment').addEventListener('click', () => {
    const content = document.querySelector('textarea#commentContent').value;
    channel.push('comment:add', { content: content });
  })
}

const commentTemplate = comment => {
  return `
  <div class="card row" style="margin-bottom: 16px">
    <div class="card-header">
      <b>${comment.user.email}</b>
    </div>
    <div class="card-body">
      ${comment.content}
    </div>
  </div>
  `
}

const renderComments = comments => {
  const renderedComments = comments.map(commentTemplate)

  document.querySelector('#commentsList').innerHTML = renderedComments.join('')
}

const renderComment = comment => {
  const renderedComment = commentTemplate(comment)

  document.querySelector('#commentsList').innerHTML += renderedComment;
}

window.createSocket = createSocket;

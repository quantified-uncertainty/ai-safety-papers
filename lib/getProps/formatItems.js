export function formatItem(item, items) {
  let formattedItem = item
  if(item.genericMarkdownContent){
    let formattedMarkdown = item.genericMarkdownContent.replace(/\n/g, "\n\n") 
    formattedItem = ({...item, genericMarkdownContent: formattedMarkdown})
  }
  return formattedItem
};
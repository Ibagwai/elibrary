export function generateBookCover(title: string, author: string, type: string) {
  const gradients = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
    'from-cyan-500 to-blue-600',
  ]
  
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const gradient = gradients[hash % gradients.length]
  
  return gradient
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const comments = [
    {
        id: 'c1',
        author: { name: 'Sarah', username: 'sarah', avatarUrl: 'https://placehold.co/40x40.png' },
        text: 'This is so relatable! We went through a similar process last year. The data migration part was brutal. Great write-up!',
        createdAt: '2 days ago',
    },
    {
        id: 'c2',
        author: { name: 'Mike', username: 'mike', avatarUrl: 'https://placehold.co/40x40.png' },
        text: 'Amazing story. That first successful demo must have felt incredible. Congrats on the launch!',
        createdAt: '1 day ago',
    },
    {
        id: 'c3',
        author: { name: 'Chloe', username: 'chloe', avatarUrl: 'https://placehold.co/40x40.png' },
        text: 'Thanks for sharing the lessons learned. "Architects, not archaeologists" - I\'m stealing that line! We are at the start of our rebuild journey and this is super inspiring.',
        createdAt: '5 hours ago',
    },
];

export default function CommentSection() {
    return (
        <section className="space-y-8">
            <h2 className="text-2xl font-bold">Comments</h2>
            
            <div className="flex items-start gap-4">
                <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <Textarea placeholder="Add a comment..." />
                    <Button>Post Comment</Button>
                </div>
            </div>

            <div className="space-y-6">
                {comments.map(comment => (
                    <div key={comment.id} className="flex items-start gap-4">
                        <Avatar>
                            <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
                            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                           <div className="flex items-center justify-between">
                             <p className="font-semibold">{comment.author.name}</p>
                             <p className="text-xs text-muted-foreground">{comment.createdAt}</p>
                           </div>
                            <p className="text-muted-foreground">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

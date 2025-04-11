
import { Card } from "@/components/ui/card";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-4xl h-[85vh] overflow-hidden shadow-xl border-indigo-100/50 flex flex-col">
        <ChatInterface />
      </Card>
    </div>
  );
};

export default Index;

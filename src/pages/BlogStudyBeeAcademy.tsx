import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import SpaceBackground from "@/components/SpaceBackground";
import TopBar from "@/components/TopBar";
import SocialLinks from "@/components/SocialLinks";
import { useReveal } from "@/hooks/use-reveal";
import heroImg from "@/assets/blog-study-bee-academy.png";

const BlogStudyBeeAcademy = () => {
  useReveal();

  return (
    <div className="min-h-screen bg-[hsl(220,60%,3%)] text-foreground relative overflow-hidden">
      <SpaceBackground density={1.2} rocks={14} planets />
      <TopBar />

      <article className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-24">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-[hsl(40,100%,70%)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all posts
        </Link>

        <div data-reveal className="flex flex-wrap items-center gap-3 mb-6 font-mono text-[10px] tracking-widest uppercase text-[hsl(195,100%,75%)]">
          <span className="px-2.5 py-1 rounded-md bg-[hsl(280,80%,65%)]/15 border border-[hsl(280,80%,65%)]/30 text-[hsl(280,80%,80%)] inline-flex items-center gap-1.5">
            <Tag className="w-3 h-3" /> Education · Community
          </span>
          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Jan 2026</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 9 min read</span>
        </div>

        <h1 data-reveal className="font-heading font-black text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight bg-gradient-to-br from-white via-[hsl(280,80%,80%)] to-[hsl(195,100%,80%)] bg-clip-text text-transparent">
          Study Bee: The Global Classroom for the Quantum Era
        </h1>

        <p data-reveal className="mt-5 text-lg text-foreground/70 leading-relaxed">
          Discovery was just the beginning. To fulfill the vision of turning Earth into a masterpiece of efficiency and beauty, we must empower every mind to master the tools of the future. <span className="text-[hsl(280,80%,80%)] font-semibold">Study Bee</span> is authorized by Shanzaib Asghar as the educational heart of our ecosystem — where humans from across the globe gather to learn the language of <span className="text-[hsl(40,100%,70%)] font-semibold">AI x Quantum Computing</span>.
        </p>

        <div data-reveal="scale" className="mt-10 relative rounded-2xl overflow-hidden border border-[hsl(280,80%,65%)]/25 shadow-[0_0_80px_-20px_hsl(280,80%,65%,0.45)]">
          <img src={heroImg} alt="Study Bee Academy — global classroom for the quantum era" className="w-full h-auto block" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[hsl(220,60%,3%)]/70 via-transparent to-transparent" />
        </div>

        <div className="mt-12 space-y-10 text-foreground/80 leading-[1.85] text-[1.05rem]">
          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(195,100%,75%)] mb-4">Mastering the Quantum Shield</h2>
            <p>
              The transition from classical to quantum thinking is the most significant leap in human history. Study Bee simplifies this journey, providing a clear roadmap from basic Python foundations to the complex world of <span className="text-[hsl(195,100%,80%)] font-semibold">Quantum Machine Learning (QML)</span>.
            </p>
            <ul className="space-y-4 mt-5">
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(195,100%,75%)] shadow-[0_0_10px_hsl(195,100%,75%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Foundation Learning:</span> Humans learn how to move beyond simple 1s and 0s, mastering concepts like Superposition and Entanglement that power the core of Bee AI.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(40,100%,60%)] shadow-[0_0_10px_hsl(40,100%,60%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">The Symbiosis (AI X Quantum):</span> We teach how these two revolutionary forces converge — using quantum logic to accelerate AI training, and using AI to manage quantum error correction.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(280,80%,75%)] shadow-[0_0_10px_hsl(280,80%,75%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Real-World Impact:</span> Our students don't just study theory; they learn how to develop chemical blueprints for Health Bee, design missions for Space Bee, and optimize the infrastructure of Quantum Bee City.</span>
              </li>
            </ul>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(40,100%,70%)] mb-4">The Study Bee Community: A Hive of Minds</h2>
            <p>
              Education at Study Bee is never a solitary journey. We have built a vibrant <span className="text-[hsl(40,100%,70%)] font-semibold">Global Community</span> where the revolution truly takes root.
            </p>
            <ul className="space-y-4 mt-5">
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(195,100%,75%)] shadow-[0_0_10px_hsl(195,100%,75%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Peer-to-Peer Knowledge:</span> Beginners talk directly to experienced researchers. Whether you are in Pakistan, the UK, or the UAE, you are connected to a hive mind dedicated to solving the world's hardest problems.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(140,70%,55%)] shadow-[0_0_10px_hsl(140,70%,55%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Collaborative Innovation:</span> Students form teams to build new "Agentic" projects, sharing code and strategies to help each other grow.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(40,100%,60%)] shadow-[0_0_10px_hsl(40,100%,60%)] flex-shrink-0" />
                <span><span className="text-white font-semibold">Direct Access to the Vision:</span> The community is a direct bridge to the latest updates from Shanzaib and the core engineering teams at Quantum Bee.</span>
              </li>
            </ul>
          </section>

          <section data-reveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(280,80%,80%)] mb-4">Why Join Study Bee?</h2>
            <p>
              The "Slow Earth" model of education is being replaced by the <span className="text-[hsl(40,100%,70%)] font-semibold">Quantum Speed</span> of communal learning. By joining Study Bee, you aren't just learning a skill; you are becoming an architect of the new world.
            </p>
            <blockquote className="my-8 relative pl-6 border-l-2 border-[hsl(280,80%,65%)]/60 italic text-base md:text-lg font-heading text-white/90 leading-snug">
              Together, we are building the intelligence needed to make our planet as beautiful and perfect as Planet Bee.
            </blockquote>
          </section>
        </div>

        <div data-reveal className="mt-16 pt-10 border-t border-[hsl(200,100%,60%)]/10 text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[hsl(195,100%,75%)] uppercase mb-4">— Follow the Swarm</p>
          <SocialLinks />
        </div>
      </article>
    </div>
  );
};

export default BlogStudyBeeAcademy;

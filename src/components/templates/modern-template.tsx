import type { ResumeData } from '@/lib/types';
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Wrench, FolderGit, Award, User } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeData;
}

const SectionTitle = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="flex items-center mb-4 mt-6 first:mt-0">
        {icon}
        <h2 className="text-2xl font-bold text-gray-800 ml-2 tracking-wide">{title}</h2>
    </div>
);

export default function ModernTemplate({ resumeData }: TemplateProps) {
  const { personalDetails, summary, workExperience, education, skills, certifications, projects } = resumeData;

  const IconWrapper = ({ children }: { children: React.ReactNode }) => <div className="text-primary">{children}</div>;
  const SectionIcon = ({ children }: { children: React.ReactNode }) => <div className="text-primary w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">{children}</div>;
  
  return (
    <div className="flex flex-col md:flex-row bg-white font-sans text-sm">
      <aside className="w-full md:w-1/3 bg-gray-50 p-6 text-gray-700">
        <div className="text-center">
            <h1 className="text-3xl font-extrabold text-primary tracking-tighter">
                {personalDetails?.name || "Your Name"}
            </h1>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-bold text-gray-600 border-b border-gray-300 pb-1">CONTACT</h3>
          <ul className="space-y-2 text-xs">
            {personalDetails?.email && <li><a href={`mailto:${personalDetails.email}`} className="flex items-center gap-2 hover:text-primary"><IconWrapper><Mail size={14}/></IconWrapper>{personalDetails.email}</a></li>}
            {personalDetails?.phone && <li className="flex items-center gap-2"><IconWrapper><Phone size={14}/></IconWrapper>{personalDetails.phone}</li>}
            {personalDetails?.location && <li className="flex items-center gap-2"><IconWrapper><MapPin size={14}/></IconWrapper>{personalDetails.location}</li>}
            {personalDetails?.linkedin && <li><a href={personalDetails.linkedin} className="flex items-center gap-2 hover:text-primary"><IconWrapper><Linkedin size={14}/></IconWrapper>LinkedIn</a></li>}
            {personalDetails?.website && <li><a href={personalDetails.website} className="flex items-center gap-2 hover:text-primary"><IconWrapper><Globe size={14}/></IconWrapper>Portfolio</a></li>}
          </ul>
        </div>
        
        {skills && skills.length > 0 && (
          <div className="mt-8 space-y-2">
            <h3 className="text-lg font-bold text-gray-600 border-b border-gray-300 pb-1">SKILLS</h3>
            <ul className="flex flex-wrap gap-2 text-xs pt-2">
              {skills.map((skill, index) => (
                <li key={index} className="bg-primary/20 text-primary font-semibold px-2 py-1 rounded-md">{skill.name}</li>
              ))}
            </ul>
          </div>
        )}

         {education && education.length > 0 && (
          <div className="mt-8 space-y-2">
            <h3 className="text-lg font-bold text-gray-600 border-b border-gray-300 pb-1">EDUCATION</h3>
            <div className="space-y-3 pt-2 text-xs">
              {education.map((edu, index) => (
                <div key={index}>
                  <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                  <p className="text-gray-600">{edu.school}</p>
                  <p className="text-gray-500 italic">{edu.graduationDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      <main className="w-full md:w-2/3 p-6 md:p-8">
        {summary && (
          <section>
            <SectionTitle icon={<SectionIcon><User size={16} /></SectionIcon>} title="Summary" />
            <p className="text-gray-600 text-justify">{summary}</p>
          </section>
        )}

        {workExperience && workExperience.length > 0 && (
          <section>
            <SectionTitle icon={<SectionIcon><Briefcase size={16} /></SectionIcon>} title="Experience" />
            <div className="space-y-5 border-l-2 border-primary/30 pl-6">
              {workExperience.map((exp, index) => (
                <div key={index} className="relative">
                    <div className="absolute -left-[30px] top-1 h-3 w-3 rounded-full bg-primary"></div>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">{exp.jobTitle}</h3>
                        <p className="text-xs font-medium text-gray-500">{exp.startDate} - {exp.endDate}</p>
                    </div>
                    <p className="font-semibold text-primary">{exp.company} <span className="text-gray-500 italic font-normal">| {exp.location}</span></p>
                    <p className="mt-2 text-gray-600 text-justify">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {projects && projects.length > 0 && (
            <section>
                <SectionTitle icon={<SectionIcon><FolderGit size={16} /></SectionIcon>} title="Projects" />
                 <div className="space-y-4">
                    {projects.map((proj, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-base text-gray-800">{proj.name}</h3>
                                {proj.link && <a href={proj.link} className="text-xs text-primary hover:underline">View Project</a>}
                            </div>
                            <p className="mt-1 text-gray-600 text-justify">{proj.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {certifications && certifications.length > 0 && (
            <section>
                <SectionTitle icon={<SectionIcon><Award size={16} /></SectionIcon>} title="Certifications" />
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {certifications.map((cert, index) => (
                        <li key={index}>
                           <span className="font-semibold">{cert.name}</span> from {cert.issuingOrg} ({cert.date})
                        </li>
                    ))}
                </ul>
            </section>
        )}

      </main>
    </div>
  );
}

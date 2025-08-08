import type { ResumeData } from '@/lib/types';

interface TemplateProps {
  resumeData: ResumeData;
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="mb-6">
        <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-3 border-b pb-2">{title}</h2>
        {children}
    </section>
);

export default function MinimalistTemplate({ resumeData }: TemplateProps) {
    const { personalDetails, summary, workExperience, education, skills, certifications, projects } = resumeData;
    const hasContactInfo = personalDetails?.email || personalDetails?.phone || personalDetails?.location || personalDetails?.linkedin || personalDetails?.website;

    return (
        <div className="p-6 md:p-10 bg-white text-gray-800 font-sans">
            <header className="mb-8">
                <h1 className="text-5xl font-extrabold tracking-tighter">
                    {personalDetails?.name || "Your Name"}
                </h1>
                {hasContactInfo && (
                    <div className="flex items-center gap-x-6 gap-y-1 mt-3 text-xs text-gray-600 flex-wrap">
                        {personalDetails?.email && <a href={`mailto:${personalDetails.email}`} className="hover:text-black">{personalDetails.email}</a>}
                        {personalDetails?.phone && <span>{personalDetails.phone}</span>}
                        {personalDetails?.location && <span>{personalDetails.location}</span>}
                        {personalDetails?.linkedin && <a href={personalDetails.linkedin} className="hover:text-black">LinkedIn</a>}
                        {personalDetails?.website && <a href={personalDetails.website} className="hover:text-black">Portfolio</a>}
                    </div>
                )}
            </header>

            {summary && (
                <Section title="Summary">
                    <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
                </Section>
            )}

            {workExperience && workExperience.length > 0 && (
                <Section title="Experience">
                    <div className="space-y-5">
                        {workExperience.map((exp, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4">
                                <div className="col-span-1 text-xs text-gray-500">
                                    <p>{exp.startDate} - {exp.endDate}</p>
                                    <p>{exp.location}</p>
                                </div>
                                <div className="col-span-3">
                                    <h3 className="font-bold text-base">{exp.jobTitle}</h3>
                                    <p className="text-sm font-semibold text-gray-600">{exp.company}</p>
                                    <p className="mt-1 text-sm text-gray-700 leading-relaxed">{exp.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {education && education.length > 0 && (
                 <Section title="Education">
                    <div className="space-y-4">
                        {education.map((edu, index) => (
                           <div key={index} className="grid grid-cols-4 gap-4">
                                <div className="col-span-1 text-xs text-gray-500">
                                    <p>{edu.graduationDate}</p>
                                    <p>{edu.location}</p>
                                </div>
                                <div className="col-span-3">
                                    <h3 className="font-bold text-base">{edu.degree}</h3>
                                    <p className="text-sm font-semibold text-gray-600">{edu.school}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {skills && skills.length > 0 && (
                <Section title="Skills">
                    <p className="text-sm text-gray-700 leading-relaxed">{skills.map(skill => skill.name).join(' · ')}</p>
                </Section>
            )}

            {projects && projects.length > 0 && (
                <Section title="Projects">
                    <div className="space-y-5">
                        {projects.map((proj, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4">
                               <div className="col-span-1 text-xs text-gray-500">
                                    {proj.link && <a href={proj.link} className="hover:text-black block">View Project</a>}
                                </div>
                                <div className="col-span-3">
                                    <h3 className="font-bold text-base">{proj.name}</h3>
                                    <p className="mt-1 text-sm text-gray-700 leading-relaxed">{proj.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}
            
            {certifications && certifications.length > 0 && (
                <Section title="Certifications">
                    <div className="space-y-2">
                        {certifications.map((cert, index) => (
                            <div key={index} className="text-sm">
                                <span className="font-bold">{cert.name}, </span>
                                <span className="text-gray-600">{cert.issuingOrg}, </span>
                                <span className="text-gray-500">{cert.date}</span>
                            </div>
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
}

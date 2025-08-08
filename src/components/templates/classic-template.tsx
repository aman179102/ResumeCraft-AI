import type { ResumeData } from '@/lib/types';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface TemplateProps {
  resumeData: ResumeData;
}

const SectionTitle = ({ title }: { title: string }) => (
    <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-1 mb-3 mt-4">
        {title.toUpperCase()}
    </h2>
);

export default function ClassicTemplate({ resumeData }: TemplateProps) {
    const { personalDetails, summary, workExperience, education, skills, certifications, projects } = resumeData;
    const hasContactInfo = personalDetails?.email || personalDetails?.phone || personalDetails?.location || personalDetails?.linkedin || personalDetails?.website;

    return (
        <div className="p-4 md:p-8 bg-white text-gray-700 font-sans text-sm">
            <header className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
                    {personalDetails?.name || "Your Name"}
                </h1>
                {hasContactInfo && (
                    <div className="flex justify-center items-center gap-x-4 gap-y-1 mt-2 text-xs flex-wrap">
                        {personalDetails?.email && <a href={`mailto:${personalDetails.email}`} className="flex items-center gap-1 hover:text-primary"><Mail size={12} />{personalDetails.email}</a>}
                        {personalDetails?.phone && <span className="flex items-center gap-1"><Phone size={12} />{personalDetails.phone}</span>}
                        {personalDetails?.location && <span className="flex items-center gap-1"><MapPin size={12} />{personalDetails.location}</span>}
                        {personalDetails?.linkedin && <a href={personalDetails.linkedin} className="flex items-center gap-1 hover:text-primary"><Linkedin size={12} />LinkedIn</a>}
                        {personalDetails?.website && <a href={personalDetails.website} className="flex items-center gap-1 hover:text-primary"><Globe size={12} />Portfolio</a>}
                    </div>
                )}
            </header>

            {summary && (
                <section>
                    <SectionTitle title="Summary" />
                    <p className="text-justify">{summary}</p>
                </section>
            )}

            {workExperience && workExperience.length > 0 && (
                <section>
                    <SectionTitle title="Work Experience" />
                    <div className="space-y-4">
                        {workExperience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-base text-gray-800">{exp.jobTitle || "Job Title"}</h3>
                                    <span className="text-xs font-medium text-gray-600">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <div className="flex justify-between items-baseline text-sm">
                                    <p className="font-semibold text-gray-700">{exp.company || "Company"}</p>
                                    <span className="text-xs italic">{exp.location}</span>
                                </div>
                                <p className="mt-1 ml-4 list-item list-disc text-justify">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {education && education.length > 0 && (
                 <section>
                    <SectionTitle title="Education" />
                    <div className="space-y-2">
                        {education.map((edu, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-base text-gray-800">{edu.degree || "Degree"}</h3>
                                     <span className="text-xs font-medium text-gray-600">{edu.graduationDate}</span>
                                </div>
                                <div className="flex justify-between items-baseline text-sm">
                                    <p className="font-semibold text-gray-700">{edu.school || "School"}</p>
                                     <span className="text-xs italic">{edu.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {skills && skills.length > 0 && (
                <section>
                    <SectionTitle title="Skills" />
                    <p>{skills.map(skill => skill.name).join(', ')}</p>
                </section>
            )}

            {projects && projects.length > 0 && (
                <section>
                    <SectionTitle title="Projects" />
                     <div className="space-y-4">
                        {projects.map((proj, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-base text-gray-800">{proj.name || "Project Name"}</h3>
                                    {proj.link && <a href={proj.link} className="text-xs text-primary hover:underline">Link</a>}
                                </div>
                                <p className="mt-1 text-justify">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {certifications && certifications.length > 0 && (
                <section>
                    <SectionTitle title="Certifications" />
                    <div className="space-y-2">
                        {certifications.map((cert, index) => (
                            <div key={index} className="flex justify-between">
                                <p className="font-semibold">{cert.name}</p>
                                <p className="text-sm">{cert.issuingOrg} - {cert.date}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

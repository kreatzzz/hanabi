import TeamMemberCard, { type TeamMember } from "@/components/team-member-card";

type TeamMembersListProps = {
  members: readonly TeamMember[];
};

export default function TeamMembersList({ members }: TeamMembersListProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-2 gap-y-7 min-[520px]:grid-cols-4 min-[520px]:gap-x-6">
      {members.map((member) => (
        <TeamMemberCard key={member.name} member={member} />
      ))}
    </ul>
  );
}

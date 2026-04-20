import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { usePageTitle } from "@/hooks/use-page-title";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, Eye, EyeOff, Trash2, Plus, FileText, Pencil, Users, Copy, ChevronDown, ChevronUp, Rocket } from "lucide-react";

interface Article {
  id: string;
  slug: string;
  type: string;
  title: string;
  category: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface FounderApplication {
  id: string;
  created_at: string;
  founder_name: string;
  email: string;
  phone: string | null;
  country: string;
  city: string | null;
  linkedin_url: string | null;
  company_name: string;
  company_website: string | null;
  industry: string;
  one_liner: string;
  num_cofounders: number;
  founded_date: string | null;
  stage: string;
  is_incubated: boolean;
  incubator_name: string | null;
  funding_amount: string | null;
  funding_type: string | null;
  grants_received: string | null;
  feature_type: string;
  message: string | null;
  status: string;
}

interface KickstartSignup {
  id: string;
  created_at: string;
  name: string;
  email: string;
  whatsapp: string;
  business_idea: string;
  help_needed: string[];
  status: string;
}

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<"articles" | "applications" | "kickstart">("articles");
  const [applications, setApplications] = useState<FounderApplication[]>([]);
  const [fetchingApps, setFetchingApps] = useState(true);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [kickstarts, setKickstarts] = useState<KickstartSignup[]>([]);
  const [fetchingKickstarts, setFetchingKickstarts] = useState(true);
  const [expandedKickstart, setExpandedKickstart] = useState<string | null>(null);
  usePageTitle("Admin Dashboard");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login", { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  const fetchArticles = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("articles")
      .select("id, slug, type, title, category, status, created_at, updated_at")
      .order("updated_at", { ascending: false });
    if (error) toast.error("Failed to load articles");
    else setArticles(data || []);
    setFetching(false);
  };

  const fetchApplications = async () => {
    setFetchingApps(true);
    const { data, error } = await supabase
      .from("founder_applications" as any)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load applications");
    else setApplications((data as unknown as FounderApplication[]) || []);
    setFetchingApps(false);
  };

  const fetchKickstarts = async () => {
    setFetchingKickstarts(true);
    const { data, error } = await supabase
      .from("kickstart_signups")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load kickstart signups");
    else setKickstarts(data || []);
    setFetchingKickstarts(false);
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchArticles();
      fetchApplications();
      fetchKickstarts();
    }
  }, [user, isAdmin]);

  const toggleStatus = async (article: Article) => {
    const newStatus = article.status === "public" ? "private" : "public";
    const { error } = await supabase.from("articles").update({ status: newStatus }).eq("id", article.id);
    if (error) toast.error("Failed to update status");
    else { toast.success(`Article ${newStatus === "public" ? "published" : "set to private"}`); fetchArticles(); }
  };

  const deleteArticle = async (article: Article) => {
    if (!confirm(`Delete "${article.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("articles").delete().eq("id", article.id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Article deleted"); fetchArticles(); }
  };

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  const copyApplicationData = (app: FounderApplication) => {
    const text = [
      `Name: ${app.founder_name}`,
      `Email: ${app.email}`,
      app.phone ? `Phone: ${app.phone}` : null,
      `Country: ${app.country}${app.city ? `, ${app.city}` : ""}`,
      app.linkedin_url ? `LinkedIn: ${app.linkedin_url}` : null,
      `Company: ${app.company_name}`,
      app.company_website ? `Website: ${app.company_website}` : null,
      `Industry: ${app.industry}`,
      `One-liner: ${app.one_liner}`,
      `Co-founders: ${app.num_cofounders}`,
      app.founded_date ? `Founded: ${app.founded_date}` : null,
      `Stage: ${app.stage}`,
      app.is_incubated ? `Incubator: ${app.incubator_name || "Yes"}` : null,
      app.funding_type ? `Funding: ${app.funding_type}${app.funding_amount ? ` (${app.funding_amount})` : ""}` : null,
      app.grants_received ? `Grants: ${app.grants_received}` : null,
      `Feature: ${app.feature_type === "founder_story" ? "Founder Story" : "Rising Founders"}`,
      app.message ? `Message: ${app.message}` : null,
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const updateAppStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("founder_applications" as any).update({ status: newStatus } as any).eq("id", id);
    if (error) toast.error("Failed to update");
    else { toast.success("Status updated"); fetchApplications(); }
  };

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading...</div>;
  if (!user || !isAdmin) return null;

  const statusColor = (s: string) => {
    if (s === "public") return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
    if (s === "private") return "bg-amber-500/10 text-amber-600 border-amber-200";
    return "bg-muted text-muted-foreground";
  };

  const appStatusColor = (s: string) => {
    if (s === "new") return "bg-blue-500/10 text-blue-600 border-blue-200";
    if (s === "reviewed") return "bg-amber-500/10 text-amber-600 border-amber-200";
    if (s === "featured") return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
    return "bg-muted text-muted-foreground";
  };

  const newAppsCount = applications.filter((a) => a.status === "new").length;

  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="px-4 sm:container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">Content Manager</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage articles, stories, and applications</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => navigate("/admin/new")}>
                <Plus className="h-4 w-4 mr-1" /> New Article
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-1" /> Sign Out
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab("articles")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === "articles"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-4 w-4" /> Articles
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === "applications"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4" /> Applications
              {newAppsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold gradient-bg text-primary-foreground">
                  {newAppsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("kickstart")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === "kickstart"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Rocket className="h-4 w-4" /> Kickstart
              {kickstarts.filter(k => k.status === "new").length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold gradient-bg text-primary-foreground">
                  {kickstarts.filter(k => k.status === "new").length}
                </span>
              )}
            </button>
          </div>

          {activeTab === "articles" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="rounded-xl border border-border p-4 bg-card">
                  <p className="text-2xl font-bold">{articles.length}</p>
                  <p className="text-xs text-muted-foreground">Total Articles</p>
                </div>
                <div className="rounded-xl border border-border p-4 bg-card">
                  <p className="text-2xl font-bold">{articles.filter(a => a.status === "public").length}</p>
                  <p className="text-xs text-muted-foreground">Published</p>
                </div>
                <div className="rounded-xl border border-border p-4 bg-card">
                  <p className="text-2xl font-bold">{articles.filter(a => a.status !== "public").length}</p>
                  <p className="text-xs text-muted-foreground">Hidden</p>
                </div>
              </div>

              {/* Article List */}
              <div className="space-y-3">
                {fetching && <p className="text-center text-muted-foreground py-8">Loading articles...</p>}
                {!fetching && articles.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No articles yet</p>
                  </div>
                )}
                {articles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 bg-card hover:border-primary/20 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[0.6rem] uppercase">
                          {article.type === "founder_story" ? "Story" : article.type === "rising_founder" ? "Rising" : "Insight"}
                        </Badge>
                        {article.category && <Badge variant="outline" className="text-[0.6rem]">{article.category}</Badge>}
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[0.6rem] font-medium border ${statusColor(article.status)}`}>
                          {article.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate">{article.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Updated {new Date(article.updated_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/admin/edit/${article.id}`)} title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStatus(article)} title={article.status === "public" ? "Set to private" : "Publish"}>
                        {article.status === "public" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteArticle(article)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "applications" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="rounded-xl border border-border p-4 bg-card">
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="rounded-xl border border-border p-4 bg-card">
                  <p className="text-2xl font-bold">{applications.filter(a => a.status === "new").length}</p>
                  <p className="text-xs text-muted-foreground">New</p>
                </div>
                <div className="rounded-xl border border-border p-4 bg-card">
                  <p className="text-2xl font-bold">{applications.filter(a => a.status === "reviewed").length}</p>
                  <p className="text-xs text-muted-foreground">Reviewed</p>
                </div>
                <div className="rounded-xl border border-border p-4 bg-card">
                  <p className="text-2xl font-bold">{applications.filter(a => a.status === "featured").length}</p>
                  <p className="text-xs text-muted-foreground">Featured</p>
                </div>
              </div>

              {/* Applications List */}
              <div className="space-y-3">
                {fetchingApps && <p className="text-center text-muted-foreground py-8">Loading applications...</p>}
                {!fetchingApps && applications.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No applications yet</p>
                  </div>
                )}
                {applications.map((app) => (
                  <div key={app.id} className="rounded-xl border border-border bg-card hover:border-primary/20 transition-colors overflow-hidden">
                    {/* Summary row */}
                    <div
                      className="flex items-center justify-between gap-4 p-4 cursor-pointer"
                      onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[0.6rem] uppercase">
                            {app.feature_type === "founder_story" ? "Story" : "Rising"}
                          </Badge>
                          <Badge variant="outline" className="text-[0.6rem]">{app.industry}</Badge>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[0.6rem] font-medium border ${appStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{app.founder_name} · <span className="text-muted-foreground">{app.company_name}</span></p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{app.one_liner}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); copyApplicationData(app); }} title="Copy all data">
                          <Copy className="h-4 w-4" />
                        </Button>
                        {expandedApp === app.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>

                    {/* Expanded details */}
                    {expandedApp === app.id && (
                      <div className="border-t border-border p-4 bg-muted/30 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                          <Detail label="Email" value={app.email} />
                          <Detail label="Phone" value={app.phone} />
                          <Detail label="Country" value={`${app.country}${app.city ? `, ${app.city}` : ""}`} />
                          <Detail label="LinkedIn" value={app.linkedin_url} isLink />
                          <Detail label="Website" value={app.company_website} isLink />
                          <Detail label="Co-founders" value={String(app.num_cofounders)} />
                          <Detail label="Stage" value={app.stage} />
                          <Detail label="Founded" value={app.founded_date} />
                          <Detail label="Incubated" value={app.is_incubated ? (app.incubator_name || "Yes") : "No"} />
                          <Detail label="Funding Type" value={app.funding_type} />
                          <Detail label="Funding Amount" value={app.funding_amount} />
                          <Detail label="Grants" value={app.grants_received} />
                        </div>
                        {app.message && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Message</p>
                            <p className="text-sm bg-background rounded-lg p-3 border border-border">{app.message}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-2">
                          <p className="text-xs text-muted-foreground mr-auto">
                            Submitted {new Date(app.created_at).toLocaleDateString()}
                          </p>
                          {app.status === "new" && (
                            <Button size="sm" variant="outline" onClick={() => updateAppStatus(app.id, "reviewed")}>Mark Reviewed</Button>
                          )}
                          {app.status !== "featured" && (
                            <Button size="sm" onClick={() => updateAppStatus(app.id, "featured")}>Mark Featured</Button>
                          )}
                          {app.status !== "archived" && (
                            <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => updateAppStatus(app.id, "archived")}>Archive</Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          {activeTab === "kickstart" && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="rounded-xl border border-border p-4 bg-card">
                  <p className="text-2xl font-bold">{kickstarts.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="rounded-xl border border-border p-4 bg-card">
                  <p className="text-2xl font-bold">{kickstarts.filter(k => k.status === "new").length}</p>
                  <p className="text-xs text-muted-foreground">New</p>
                </div>
                <div className="rounded-xl border border-border p-4 bg-card">
                  <p className="text-2xl font-bold">{kickstarts.filter(k => k.status === "contacted").length}</p>
                  <p className="text-xs text-muted-foreground">Contacted</p>
                </div>
              </div>

              <div className="space-y-3">
                {fetchingKickstarts && <p className="text-center text-muted-foreground py-8">Loading signups...</p>}
                {!fetchingKickstarts && kickstarts.length === 0 && (
                  <div className="text-center py-12">
                    <Rocket className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No kickstart signups yet</p>
                  </div>
                )}
                {kickstarts.map((k) => (
                  <div key={k.id} className="rounded-xl border border-border bg-card hover:border-primary/20 transition-colors overflow-hidden">
                    <div
                      className="flex items-center justify-between gap-4 p-4 cursor-pointer"
                      onClick={() => setExpandedKickstart(expandedKickstart === k.id ? null : k.id)}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[0.6rem] font-medium border ${
                            k.status === "new" ? "bg-blue-500/10 text-blue-600 border-blue-200" :
                            k.status === "contacted" ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {k.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{k.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{k.business_idea}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                          e.stopPropagation();
                          const text = `Name: ${k.name}\nEmail: ${k.email}\nWhatsApp: ${k.whatsapp}\nBusiness Idea: ${k.business_idea}\nHelp Needed: ${k.help_needed.join(", ")}`;
                          navigator.clipboard.writeText(text);
                          toast.success("Copied!");
                        }} title="Copy">
                          <Copy className="h-4 w-4" />
                        </Button>
                        {expandedKickstart === k.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>

                    {expandedKickstart === k.id && (
                      <div className="border-t border-border p-4 bg-muted/30 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                          <Detail label="Email" value={k.email} />
                          <Detail label="WhatsApp" value={k.whatsapp} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Business Idea</p>
                          <p className="text-sm bg-background rounded-lg p-3 border border-border">{k.business_idea}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Help Needed</p>
                          <div className="flex flex-wrap gap-1.5">
                            {k.help_needed.map((h) => (
                              <Badge key={h} variant="outline" className="text-xs">{h}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <p className="text-xs text-muted-foreground mr-auto">
                            Submitted {new Date(k.created_at).toLocaleDateString()}
                          </p>
                          {k.status === "new" && (
                            <Button size="sm" onClick={async () => {
                              const { error } = await supabase.from("kickstart_signups").update({ status: "contacted" }).eq("id", k.id);
                              if (error) toast.error("Failed to update");
                              else { toast.success("Marked as contacted"); fetchKickstarts(); }
                            }}>Mark Contacted</Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

const Detail = ({ label, value, isLink }: { label: string; value: string | null; isLink?: boolean }) => {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground shrink-0">{label}:</span>
      {isLink ? (
        <a href={value.startsWith("http") ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{value}</a>
      ) : (
        <span className="text-foreground truncate">{value}</span>
      )}
    </div>
  );
};

export default AdminDashboard;

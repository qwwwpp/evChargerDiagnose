import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KnowledgeBase() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 pb-16 md:pb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Knowledge Base</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Common Error Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <div className="font-medium">E-304</div>
                <p className="text-sm text-slate-600">Communication error with charging control module. Check network connectivity and firmware.</p>
              </li>
              <li>
                <div className="font-medium">E-187</div>
                <p className="text-sm text-slate-600">Power relay failure. Inspect internal connections and replace if necessary.</p>
              </li>
              <li>
                <div className="font-medium">E-092</div>
                <p className="text-sm text-slate-600">Temperature sensor out of range. Check for blockage in cooling system.</p>
              </li>
              <li>
                <div className="font-medium">E-156</div>
                <p className="text-sm text-slate-600">Ground fault detected. Inspect for water ingress or damaged insulation.</p>
              </li>
            </ul>
            <div className="mt-4">
              <a href="#" className="text-sm text-teal-700 hover:text-teal-800 font-medium">View all error codes →</a>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Maintenance Procedures</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <div className="font-medium">Connector Inspection</div>
                <p className="text-sm text-slate-600">Steps to inspect and clean charging connectors for optimal performance.</p>
              </li>
              <li>
                <div className="font-medium">Firmware Updates</div>
                <p className="text-sm text-slate-600">Procedure for safely updating charger firmware via maintenance port.</p>
              </li>
              <li>
                <div className="font-medium">Power Module Replacement</div>
                <p className="text-sm text-slate-600">Guide for safely replacing power modules in DC fast chargers.</p>
              </li>
            </ul>
            <div className="mt-4">
              <a href="#" className="text-sm text-teal-700 hover:text-teal-800 font-medium">View all procedures →</a>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Technical Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <div className="font-medium">PowerFlow DC5000</div>
                <p className="text-sm text-slate-600">Technical specifications, wiring diagrams, and service manuals.</p>
              </li>
              <li>
                <div className="font-medium">PowerFlow AC200/300</div>
                <p className="text-sm text-slate-600">Level 2 charger specifications and installation guides.</p>
              </li>
              <li>
                <div className="font-medium">PowerFlow DC3000</div>
                <p className="text-sm text-slate-600">Mid-tier DC charger specifications and troubleshooting guides.</p>
              </li>
            </ul>
            <div className="mt-4">
              <a href="#" className="text-sm text-teal-700 hover:text-teal-800 font-medium">View all specifications →</a>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h3 className="font-medium">Troubleshooting Network Connectivity Issues</h3>
            <p className="text-sm text-slate-600 mt-2">
              This guide covers common network connectivity problems with EV chargers, including cellular signal issues, 
              WiFi configuration problems, and backend communication errors.
            </p>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-slate-500">Published 3 days ago</span>
              <span className="mx-2">•</span>
              <a href="#" className="text-teal-700 hover:text-teal-800 font-medium">Read article</a>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h3 className="font-medium">Diagnostic Tool Update: Version 2.4 Release Notes</h3>
            <p className="text-sm text-slate-600 mt-2">
              Important information about the latest diagnostic tool update, including new features for error code analysis,
              remote diagnostics capabilities, and firmware update improvements.
            </p>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-slate-500">Published 1 week ago</span>
              <span className="mx-2">•</span>
              <a href="#" className="text-teal-700 hover:text-teal-800 font-medium">Read article</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
